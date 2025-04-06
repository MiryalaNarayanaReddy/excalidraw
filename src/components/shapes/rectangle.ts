

function hex2rgba(hex: string, opacity: number) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    let a = opacity;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}
  
  

class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke: string;
    fill: string;
    roughness: number;
    strokeWidth: number;
    strokeStyle: string;
    opacity: number;

    constructor(x: number, y: number, width: number, height: number, stroke: string, fill: string, roughness: number, strokeWidth: number, strokeStyle: string, opacity: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stroke = stroke;
        this.fill = fill;
        this.roughness = roughness;
        this.strokeWidth = strokeWidth;
        this.strokeStyle = strokeStyle;
        this.opacity = opacity;
    }
    
    draw(rc: any){

        console.log("draw rectangle");
        let dashed = null;
        if (this.strokeStyle === "dashed") {
          dashed = [10, 10]
        }
        else if (this.strokeStyle === "dotted") {
          dashed = [5, 5]
        }
        else {
          dashed = null
        }

        rc.rectangle(this.x, this.y, this.width, this.height, {
          fill: hex2rgba(this.fill, this.opacity / 100),
          fillStyle: "solid",
          stroke: hex2rgba(this.stroke, this.opacity / 100),
          strokeWidth: this.strokeWidth,
          roughness: this.roughness,
          strokeLineDash: dashed,
        });

    }

    contains(x: number, y: number) {

      // check if cursor is inside rectangle 

      // x insde (x, x + width) and y inside (y, y + height)
      if(x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height){
        return true;
      }
      else{
        return false;
      }
      
    }

    getBounds() {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height,
        };
    }

    getSelectionBox(){
      let padding = 5;
      
      return {
        point1: {
          x: this.x - padding,
          y: this.y - padding,
        },
        point2: {
          x: this.x + this.width + padding,
          y: this.y + this.height + padding,
        },
      }
       
    }

    move(x1: number, y1: number,moveX: number, moveY: number){

    console.log("move rectangle");
    console.log(x1,y1,moveX,moveY);
    console.log(this.x,this.y);
      
      this.x = this.x + (moveX-x1);
      this.y = this.y + (moveY-y1);

    }

}


export default Rectangle;