

//@ts-ignore
function crossProduct(a, b) {
    return {x: a.x * b.y - a.y * b.x, y: a.y * b.x - a.x * b.y};
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
        // d = aXb/|a| 

        let a = {x:this.point1.x - this.point2.x,y: this.point1.y - this.point2.y};
        // @ts-ignore
        let b = {x: x-this.point1.x,y: y-this.point1.y}

        let axb = crossProduct(a,b);
        let modA = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
        let modaxb = Math.sqrt(Math.pow(axb.x, 2) + Math.pow(axb.y, 2));

        if(modA === 0){
            return false;
        } 

        let t = Math.abs(modaxb / modA);

        // console.log(modA,modaxb,t);

        if(t>=0 && t < 5){
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