

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
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    getBounds() {
        return {
            left: this.x,
            top: this.y,
            right: this.x + this.width,
            bottom: this.y + this.height,
        };
    }

}


export default Rectangle;