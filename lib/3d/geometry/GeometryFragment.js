export class GeometryFragment {
    constructor(data) {
        this.id = data.id;
        this.baseGeometry = data.geometry;
        this.start = data.start;
        this.size = data.size;
    }
    castToBaseGeometry() {
        return this.baseGeometry;
    }
}
