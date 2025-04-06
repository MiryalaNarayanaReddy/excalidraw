

//@ts-ignore
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y;
}

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


        // check perpendicular distance between line and point 

        // c = a.b/|a|^2  // d = |c*a-b|  // a is a vector and b is a point . d = perpendicular distance between line and point

        let a = {x:this.point1.x - this.point2.x,y: this.point1.y - this.point2.y};
        // @ts-ignore
        let b = {x:x - this.point2.x, y:y - this.point2.y};  

        let ab = dotProduct(a, b);
        let modA = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
        let c = ab / Math.pow(modA, 2);

        let dv = {x:c*a.x-b.x, y:c*a.y-b.y};

        let d = Math.sqrt(Math.pow(dv.x, 2) + Math.pow(dv.y, 2));

        if(d <= 5){
          return true;
        }
        else{
          return false;
        }
        
    }

    getBounds() {
        return {
            left: Math.min(this.point1.x, this.point2.x),
            top: Math.min(this.point1.y, this.point2.y),
            right: Math.max(this.point1.x, this.point2.x),
            bottom: Math.max(this.point1.y, this.point2.y),
        };
    }

    getSelectionBox(){
      let padding = 5;
      
      return {
        point1: {
          x: Math.min(this.point1.x, this.point2.x) - padding,
          y: Math.min(this.point1.y, this.point2.y) - padding,
        },
        point2: {
          x: Math.max(this.point1.x, this.point2.x) + padding,
          y: Math.max(this.point1.y, this.point2.y) + padding,
        },
      }
       
    }

}

export  default Line;