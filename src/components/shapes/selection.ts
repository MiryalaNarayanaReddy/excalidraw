type Point = { x: number; y: number };


class SelectionBox {

    private point1: Point;
    private point2: Point;
    private handles: Array<Point & { cursor: string }>;

    constructor(point1: Point, point2: Point) {
        this.point1 = point1;
        this.point2 = point2;
        this.handles = [
            { x: point1.x, y: point1.y, cursor: "nwse-resize" }, // Top-left
            { x: point2.x, y: point1.y, cursor: "nesw-resize" }, // Top-right
            { x: point1.x, y: point2.y, cursor: "nesw-resize" }, // Bottom-left
            { x: point2.x, y: point2.y, cursor: "nwse-resize" }  // Bottom-right
        ];
    }

    draw(roughCanvas: any) {

        const width = this.point2.x - this.point1.x;
        const height = this.point2.y - this.point1.y;

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

        const handleSize = 6;
        const halfHandle = handleSize / 2;

        for (const handle of this.handles) {
            if (
                clientX >= handle.x - halfHandle &&
                clientX <= handle.x + halfHandle &&
                clientY >= handle.y - halfHandle &&
                clientY <= handle.y + halfHandle
            ) {
                document.body.style.cursor = handle.cursor;
                return;
            }
        }

        // 2. If not on a handle, check if the mouse is within the rectangle
        if (
            clientX >= this.point1.x &&
            clientX <= this.point2.x &&
            clientY >= this.point1.y &&
            clientY <= this.point2.y
        ) {
            const margin = 5; // margin in pixels for edge detection

            // Determine if near any edge by checking against a margin.
            const nearLeft = Math.abs(clientX - this.point1.x) < margin;
            const nearRight = Math.abs(clientX - this.point2.x) < margin;
            const nearTop = Math.abs(clientY - this.point1.y) < margin;
            const nearBottom = Math.abs(clientY - this.point2.y) < margin;

            // If near two edges, choose a diagonal resize cursor.
            if (nearLeft && nearTop) {
                document.body.style.cursor = "nwse-resize";
            } else if (nearRight && nearTop) {
                document.body.style.cursor = "nesw-resize";
            } else if (nearLeft && nearBottom) {
                document.body.style.cursor = "nesw-resize";
            } else if (nearRight && nearBottom) {
                document.body.style.cursor = "nwse-resize";
            } else if (nearLeft || nearRight) {
                document.body.style.cursor = "ew-resize";
            } else if (nearTop || nearBottom) {
                document.body.style.cursor = "ns-resize";
            } else {
                // Otherwise, if the mouse is inside but not near an edge, set move cursor.
                document.body.style.cursor = "move";
            }
        } else {
            // If outside the rectangle, revert to default cursor.
            document.body.style.cursor = "default";
        }
    }
}


export default SelectionBox;