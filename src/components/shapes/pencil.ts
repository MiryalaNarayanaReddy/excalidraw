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
        // Check if point is near any line segment
        for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            
            // Calculate distance from point to line segment
            const lineLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            if (lineLength === 0) continue;
            
            const t = ((x - p1.x) * (p2.x - p1.x) + (y - p1.y) * (p2.y - p1.y)) / (lineLength * lineLength);
            
            if (t < 0) {
                // Closest to p1
                const dist = Math.sqrt(Math.pow(x - p1.x, 2) + Math.pow(y - p1.y, 2));
                if (dist <= 5) return true;
            } else if (t > 1) {
                // Closest to p2
                const dist = Math.sqrt(Math.pow(x - p2.x, 2) + Math.pow(y - p2.y, 2));
                if (dist <= 5) return true;
            } else {
                // Closest to point on line
                const projX = p1.x + t * (p2.x - p1.x);
                const projY = p1.y + t * (p2.y - p1.y);
                const dist = Math.sqrt(Math.pow(x - projX, 2) + Math.pow(y - projY, 2));
                if (dist <= 5) return true;
            }
        }
        return false;
    }

    // Modified erase method to check if the point is part of the drawing
    shouldErase(x: number, y: number, radius: number = 10): boolean {
        return this.contains(x, y);
    }

    getBounds() {
        if (this.points.length === 0) {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        }

        let left = this.points[0].x;
        let top = this.points[0].y;
        let right = this.points[0].x;
        let bottom = this.points[0].y;

        for (let i = 1; i < this.points.length; i++) {
            left = Math.min(left, this.points[i].x);
            top = Math.min(top, this.points[i].y);
            right = Math.max(right, this.points[i].x);
            bottom = Math.max(bottom, this.points[i].y);
        }

        return { left, top, right, bottom };
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
        this.points = this.points.map(point => ({
            x: point.x + dx,
            y: point.y + dy
        }));
    }

    resize(handleType: string, startX: number, startY: number, endX: number, endY: number) {
        const bounds = this.getBounds();
        const dx = endX - startX;
        const dy = endY - startY;
        const scaleX = (endX - bounds.left) / (startX - bounds.left);
        const scaleY = (endY - bounds.top) / (startY - bounds.top);

        this.points = this.points.map(point => {
            let newX = point.x;
            let newY = point.y;

            switch(handleType) {
                case "top-left":
                case "left":
                case "bottom-left":
                    newX = bounds.left + (point.x - bounds.left) * scaleX;
                    break;
                case "top-right":
                case "right":
                case "bottom-right":
                    newX = bounds.left + (point.x - bounds.left) * scaleX;
                    break;
            }

            switch(handleType) {
                case "top-left":
                case "top":
                case "top-right":
                    newY = bounds.top + (point.y - bounds.top) * scaleY;
                    break;
                case "bottom-left":
                case "bottom":
                case "bottom-right":
                    newY = bounds.top + (point.y - bounds.top) * scaleY;
                    break;
            }

            return { x: newX, y: newY };
        });
    }
}

export default Pencil;