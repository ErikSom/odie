let UID = 0;
export class HowFast {
    constructor() {
        this._checks = {};
        this._html = document.createElement('div');
        this._html.style.zIndex = '10000';
        this._html.style.position = 'absolute';
        this._html.innerHTML = 'How fast:';
        this._html.style.pointerEvents = 'none';
        this._html.style.right = '1px';
        this._html.style.top = '0px';
        this._html.style.backgroundColor = 'white';
        document.body.appendChild(this._html);
    }
    write(output) {
        this._html.innerHTML += `</br>${output}`;
    }
    start(id = 'x') {
        const check = performance.now();
        let stuff = this._checks[id];
        if (!stuff) {
            stuff = this._checks[id] = { div: document.createElement('div'), check, tick: 0, total: 0 };
            this._html.appendChild(stuff.div);
        }
        this._checks[id].check = check;
    }
    stop(id = 'x') {
        const stuff = this._checks[id];
        if (stuff) {
            const start = stuff.check;
            const time = (performance.now() - start) * 100000;
            stuff.tick++;
            stuff.total += time;
            const average = stuff.total / stuff.tick;
            {
                const output = `</br>${id}: ${average | 0} `;
                stuff.div.innerHTML = output;
            }
        }
    }
    is(func, id) {
        // eslint-disable-next-line no-undef
        id = id || `_${UID++}`;
        this.start(id);
        func();
        this.stop(id);
    }
}
