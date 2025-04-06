

type Point = { x: number; y: number };

class Line {
    point1: Point;
    point2: Point;
    stroke: string;
    fill: string;
    strokeWidth: number;
    strokeStyle: string;
    sloppiness: number;
    opacity: number;

    constructor(point1: Point, point2: Point, stroke: string, fill: string, strokeWidth: number, strokeStyle: string, sloppiness: number, opacity: number) {
        this.point1 = point1;
        this.point2 = point2;
        this.stroke = stroke;
        this.fill = fill;
        this.strokeWidth = strokeWidth;
        this.strokeStyle = strokeStyle;
        this.sloppiness = sloppiness;
        this.opacity = opacity;
    }
    
    draw(rc: any){
        rc.draw(rc.generator.line(this.point1.x, this.point1.y, this.point2.x, this.point2.y, {
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            roughness: this.sloppiness,
            strokeLineDash: this.strokeStyle === "dashed" ? [10, 10] : null,
        }));
    }

    contains(x: number, y: number) {
        return (
            x >= Math.min(this.point1.x, this.point2.x) &&
            x <= Math.max(this.point1.x, this.point2.x) &&
            y >= Math.min(this.point1.y, this.point2.y) &&
            y <= Math.max(this.point1.y, this.point2.y)
        );
    }

    getBounds() {
        return {
            left: Math.min(this.point1.x, this.point2.x),
            top: Math.min(this.point1.y, this.point2.y),
            right: Math.max(this.point1.x, this.point2.x),
            bottom: Math.max(this.point1.y, this.point2.y),
        };
    }

}

export  default Line;