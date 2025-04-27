type Point = { x: number; y: number };


class SelectionBox {

    private point1: Point;
    private point2: Point;
    private handles: Array<Point & { cursor: string, type: string }> = [];

    constructor(point1: Point, point2: Point) {
        this.point1 = point1;
        this.point2 = point2;
        this.updateHandles();
    }

    private updateHandles() {
        this.handles = [
            { x: this.point1.x, y: this.point1.y, cursor: "nwse-resize", type: "top-left" },
            { x: (this.point1.x + this.point2.x) / 2, y: this.point1.y, cursor: "ns-resize", type: "top" },
            { x: this.point2.x, y: this.point1.y, cursor: "nesw-resize", type: "top-right" },
            { x: this.point1.x, y: (this.point1.y + this.point2.y) / 2, cursor: "ew-resize", type: "left" },
            { x: this.point2.x, y: (this.point1.y + this.point2.y) / 2, cursor: "ew-resize", type: "right" },
            { x: this.point1.x, y: this.point2.y, cursor: "nesw-resize", type: "bottom-left" },
            { x: (this.point1.x + this.point2.x) / 2, y: this.point2.y, cursor: "ns-resize", type: "bottom" },
            { x: this.point2.x, y: this.point2.y, cursor: "nwse-resize", type: "bottom-right" }
        ];
    }

    updatePoints(point1: Point, point2: Point) {
        this.point1 = point1;
        this.point2 = point2;
        this.updateHandles();
    }

    draw(roughCanvas: any) {
        const width = this.point2.x - this.point1.x;
        const height = this.point2.y - this.point1.y;

        // Draw selection box
        roughCanvas.draw(
            roughCanvas.generator.rectangle(this.point1.x, this.point1.y, width, height, {
                stroke: "rgba(0, 0, 0, 0.5)",
                strokeWidth: 1,
                roughness: 0,
                bowing: 0,
                fill: "rgba(0, 0, 0, 0)",
                fillStyle: "solid"
            })
        );

        // Define handle size
        const handleSize = 6;
        const halfHandle = handleSize / 2;

        // Draw handles
        this.handles.forEach(handle => {
            roughCanvas.draw(
                roughCanvas.generator.rectangle(
                    handle.x - halfHandle,
                    handle.y - halfHandle,
                    handleSize,
                    handleSize,
                    {
                        fill: "#fff",
                        fillStyle: "solid",
                        stroke: "blue",
                        strokeWidth: 0.5
                    }
                )
            );
        });
    }

    mouseOverHandle(clientX: number, clientY: number) {
        const handleSize = 8; // Slightly larger for better usability
        const halfHandle = handleSize / 2;
        const edgeMargin = 6; // Margin for edge detection

        // Check if mouse is within the selection box bounds
        const isInsideBox = 
            clientX >= this.point1.x - edgeMargin &&
            clientX <= this.point2.x + edgeMargin &&
            clientY >= this.point1.y - edgeMargin &&
            clientY <= this.point2.y + edgeMargin;

        if (!isInsideBox) {
            document.body.style.cursor = "default";
            return "outside";
        }

        // Check handles first
        for (const handle of this.handles) {
            if (
                clientX >= handle.x - halfHandle &&
                clientX <= handle.x + halfHandle &&
                clientY >= handle.y - halfHandle &&
                clientY <= handle.y + halfHandle
            ) {
                document.body.style.cursor = handle.cursor;
                return handle.type;
            }
        }

        // Check edges with a slightly larger hit area
        const nearLeft = Math.abs(clientX - this.point1.x) < edgeMargin;
        const nearRight = Math.abs(clientX - this.point2.x) < edgeMargin;
        const nearTop = Math.abs(clientY - this.point1.y) < edgeMargin;
        const nearBottom = Math.abs(clientY - this.point2.y) < edgeMargin;

        if (nearLeft && nearTop) {
            document.body.style.cursor = "nwse-resize";
            return "top-left";
        }
        if (nearRight && nearTop) {
            document.body.style.cursor = "nesw-resize";
            return "top-right";
        }
        if (nearLeft && nearBottom) {
            document.body.style.cursor = "nesw-resize";
            return "bottom-left";
        }
        if (nearRight && nearBottom) {
            document.body.style.cursor = "nwse-resize";
            return "bottom-right";
        }
        if (nearLeft) {
            document.body.style.cursor = "ew-resize";
            return "left";
        }
        if (nearRight) {
            document.body.style.cursor = "ew-resize";
            return "right";
        }
        if (nearTop) {
            document.body.style.cursor = "ns-resize";
            return "top";
        }
        if (nearBottom) {
            document.body.style.cursor = "ns-resize";
            return "bottom";
        }

        // If inside the box but not near any edges
        document.body.style.cursor = "move";
        return "inside";
    }
}


export default SelectionBox;