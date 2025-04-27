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
        this.x += dx;
        this.y += dy;
    }

    resize(handleType: string, startX: number, startY: number, endX: number, endY: number) {
        const bounds = this.getBounds();
        const dx = endX - startX;
        const dy = endY - startY;

        switch(handleType) {
            case "top-left":
                this.x = endX;
                this.y = endY;
                this.width = bounds.right - endX;
                this.height = bounds.bottom - endY;
                break;
            case "top-right":
                this.y = endY;
                this.width = endX - bounds.left;
                this.height = bounds.bottom - endY;
                break;
            case "bottom-left":
                this.x = endX;
                this.width = bounds.right - endX;
                this.height = endY - bounds.top;
                break;
            case "bottom-right":
                this.width = endX - bounds.left;
                this.height = endY - bounds.top;
                break;
            case "left":
                this.x = endX;
                this.width = bounds.right - endX;
                break;
            case "right":
                this.width = endX - bounds.left;
                break;
            case "top":
                this.y = endY;
                this.height = bounds.bottom - endY;
                break;
            case "bottom":
                this.height = endY - bounds.top;
                break;
        }

        // Ensure width and height are positive
        if (this.width < 0) {
            this.x += this.width;
            this.width = Math.abs(this.width);
        }
        if (this.height < 0) {
            this.y += this.height;
            this.height = Math.abs(this.height);
        }
    }

    containsPoint(x: number, y: number): boolean {
        // Calculate the center of the ellipse
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Calculate the distance from the point to the center
        const dx = (x - centerX) / (this.width / 2);
        const dy = (y - centerY) / (this.height / 2);
        
        // Check if the point is inside the ellipse
        return dx * dx + dy * dy <= 1;
    }
}   

export default Elipse;