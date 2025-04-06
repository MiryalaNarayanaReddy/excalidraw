
import rough from "roughjs";

type Point = { x: number; y: number };

function hex2rgba(hex: string, opacity: number) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    let a = opacity;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}
  
class Pencil {
    points: Point[];
    stroke: string;
    fill: string;
    strokeWidth: number;
    strokeStyle: string;
    sloppiness: number;
    opacity: number;

    constructor(points: Point[], stroke: string, fill: string, strokeWidth: number, strokeStyle: string, sloppiness: number, opacity: number) {
        this.points = points;
        this.stroke = stroke;
        this.fill = fill;
        this.strokeWidth = strokeWidth;
        this.strokeStyle = strokeStyle;
        this.sloppiness = sloppiness;
        this.opacity = opacity;
    }
    
    draw(rc: any){

        let dashed = undefined;
        if (this.strokeStyle === "dashed") {
          dashed = [10, 10]

        }
        else if (this.strokeStyle === "dotted") {
          dashed = [5, 5]
        }
        else if (this.strokeStyle === "solid") {
          dashed = undefined
        }

    //     let dashed = null;
    //     if (shape.strokeStyle === "dashed") {
    //       dashed = [10, 10]

    //     }
    //     else if (shape.strokeStyle === "dotted") {
    //       dashed = [5, 5]
    //     }
    //     else {
    //       dashed = null
    //     }


    //     const generator = rough.generator();
    //     const points = shape.points.map((point) => [point.x, point.y]);
    //     for (let i = 0; i < points.length - 1; i++) {
    //       const line = generator.line(
    //         points[i][0],
    //         points[i][1],
    //         points[i + 1][0],
    //         points[i + 1][1],
    //         {
    //           stroke: hex2rgba(shape.stroke, shape.opacity / 100),
    //           strokeWidth: shape.strokeWidth,
    //           roughness: shape.sloppiness,
    //           strokeLineDash: dashed,
    //         }
    //       );
    //       rc.draw(line);
    //     }
    //   }

    const generator = rough.generator();
    const points = this.points.map((point) => [point.x, point.y]);
    for (let i = 0; i < points.length - 1; i++) {
      const line = generator.line(
        points[i][0],
        points[i][1],
        points[i + 1][0],
        points[i + 1][1],
        {
          stroke: hex2rgba(this.stroke, this.opacity / 100),
          strokeWidth: this.strokeWidth,
          roughness: this.sloppiness,
          strokeLineDash: dashed,
        }
      );
      rc.draw(line);
    }


    }

    contains(x: number, y: number) {
      
    }

    getBounds() {
      
    }

}

export default Pencil;