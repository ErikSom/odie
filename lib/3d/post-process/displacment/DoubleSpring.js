export class DoubleSpring {
    constructor() {
        this.x = 0;
        this.ax = 0;
        this.dx = 0;
        this.tx = 0;
        this.y = 0;
        this.ay = 0;
        this.dy = 0;
        this.ty = 0;
        this.max = 30;
        this.damp = 0.75;
        this.springiness = 0.09;
        this.max = 160;
        this.damp = 0.85;
        this.springiness = 0.29;
    }
    update() {
        this.ax = (this.tx - this.x) * this.springiness;
        this.dx += this.ax;
        this.dx *= this.damp;
        if (this.dx < -this.max)
            this.dx = -this.max;
        else if (this.dx > this.max)
            this.dx = this.max;
        this.x += this.dx;
        this.ay = (this.ty - this.y) * this.springiness;
        this.dy += this.ay;
        this.dy *= this.damp;
        if (this.dy < -this.max)
            this.dy = -this.max;
        else if (this.dy > this.max)
            this.dy = this.max;
        this.y += this.dy;
    }
    reset() {
        this.x = 0;
        this.ax = 0;
        this.dx = 0;
        this.tx = 0;
        this.y = 0;
        this.ay = 0;
        this.dy = 0;
        this.ty = 0;
    }
}
