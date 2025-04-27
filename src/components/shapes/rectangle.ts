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

  draw(rc: any) {
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
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
      return true;
    }
    else {
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

  getSelectionBox() {
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
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
}

export default Rectangle;