class Elipse {
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
        rc.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height, {
            fill: this.fill,
            fillStyle: "solid",
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            roughness: this.roughness,
            strokeLineDash: this.strokeStyle === "dashed" ? [10, 10] : null,
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


export default Elipse;