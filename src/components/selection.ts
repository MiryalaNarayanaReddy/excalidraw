
type Point = { x: number; y: number };

function drawSelection({ point1, point2, roughCanvas }: { point1: Point; point2: Point; roughCanvas: any }) {
    if (!roughCanvas || !point1 || !point2) return;
    
    const width = point2.x - point1.x;
    const height = point2.y - point1.y;
    
    roughCanvas.draw(
        roughCanvas.generator.rectangle(point1.x, point1.y, width, height, {
            stroke: "rgba(0, 0, 0, 0.5)",
            strokeWidth: 1,
            roughness: 0,
            bowing: 0,
            fill: "#fff",
            fillStyle: "solid",
            strokeLineDash: [5, 5],
        })
    );

    // Define handle size
    const handleSize = 6;
    const halfHandle = handleSize / 2;
    
    // Corner and edge center points
    const handles = [
        { x: point1.x, y: point1.y, cursor: "nwse-resize" }, // Top-left
        { x: point2.x, y: point1.y, cursor: "nesw-resize" }, // Top-right
        { x: point1.x, y: point2.y, cursor: "nesw-resize" }, // Bottom-left
        { x: point2.x, y: point2.y, cursor: "nwse-resize" }, // Bottom-right
    ];

    // Draw handles
    handles.forEach(handle => {
        roughCanvas.draw(
            roughCanvas.generator.rectangle(handle.x - halfHandle, handle.y - halfHandle, handleSize, handleSize, {
                fill: "#fff",
                fillStyle: "solid",
                stroke: "blue",
                strokeWidth: 0.5,
            })
        );
    });

    // Handle cursor changes (this should be done in event listeners in the main app logic)
    document.addEventListener("mousemove", (event) => {
        const { clientX, clientY } = event;
        handles.forEach(handle => {
            if (
                clientX >= handle.x - halfHandle && clientX <= handle.x + halfHandle &&
                clientY >= handle.y - halfHandle && clientY <= handle.y + halfHandle
            ) {
                document.body.style.cursor = handle.cursor;
            }
        });
    });
}

export default drawSelection;
