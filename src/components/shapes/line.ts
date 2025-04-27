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
      const bounds = this.getBounds();
      
      return {
        point1: {
          x: bounds.left - padding,
          y: bounds.top - padding,
        },
        point2: {
          x: bounds.right + padding,
          y: bounds.bottom + padding,
        },
      }
    }

    move(startX: number, startY: number, endX: number, endY: number) {
        const dx = endX - startX;
        const dy = endY - startY;
        this.point1.x += dx;
        this.point1.y += dy;
        this.point2.x += dx;
        this.point2.y += dy;
    }

    resize(handleType: string, startX: number, startY: number, endX: number, endY: number) {
        switch(handleType) {
            case "top-left":
                this.point1.x = endX;
                this.point1.y = endY;
                break;
            case "top-right":
                this.point2.x = endX;
                this.point1.y = endY;
                break;
            case "bottom-left":
                this.point1.x = endX;
                this.point2.y = endY;
                break;
            case "bottom-right":
                this.point2.x = endX;
                this.point2.y = endY;
                break;
            case "left":
                this.point1.x = endX;
                break;
            case "right":
                this.point2.x = endX;
                break;
            case "top":
                this.point1.y = endY;
                break;
            case "bottom":
                this.point2.y = endY;
                break;
        }
    }

    isNearPoint(x: number, y: number, threshold: number = 5): boolean {
        // Calculate the distance from the point to the line
        const dx = this.point2.x - this.point1.x;
        const dy = this.point2.y - this.point1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) {
            // If the line is a point, check if the point is within the threshold
            return Math.sqrt((x - this.point1.x) ** 2 + (y - this.point1.y) ** 2) <= threshold;
        }
        
        // Calculate the projection of the point onto the line
        const t = ((x - this.point1.x) * dx + (y - this.point1.y) * dy) / (length * length);
        
        if (t < 0) {
            // Point is before the start of the line
            return Math.sqrt((x - this.point1.x) ** 2 + (y - this.point1.y) ** 2) <= threshold;
        } else if (t > 1) {
            // Point is after the end of the line
            return Math.sqrt((x - this.point2.x) ** 2 + (y - this.point2.y) ** 2) <= threshold;
        } else {
            // Point is along the line
            const projectionX = this.point1.x + t * dx;
            const projectionY = this.point1.y + t * dy;
            return Math.sqrt((x - projectionX) ** 2 + (y - projectionY) ** 2) <= threshold;
        }
    }
}

export default Line;