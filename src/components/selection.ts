type Point = { x: number; y: number };

function drawSelection(point1: Point, point2: Point, roughCanvas: any) {
  if (!roughCanvas || !point1 || !point2) return;

  const width = point2.x - point1.x;
  const height = point2.y - point1.y;

  // Draw selection rectangle
  roughCanvas.draw(
    roughCanvas.generator.rectangle(point1.x, point1.y, width, height, {
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

  // Define handle positions and corresponding cursors (for corners)
  const handles = [
    { x: point1.x, y: point1.y, cursor: "nwse-resize" }, // Top-left
    { x: point2.x, y: point1.y, cursor: "nesw-resize" }, // Top-right
    { x: point1.x, y: point2.y, cursor: "nesw-resize" }, // Bottom-left
    { x: point2.x, y: point2.y, cursor: "nwse-resize" }  // Bottom-right
  ];

  // Draw handles on the corners
  handles.forEach(handle => {
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

  // Single mousemove event listener for proper cursor handling
  const margin = 5; // margin in pixels for edge detection

  function onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;

    // 1. Check if the mouse is over a handle (highest priority)
    for (const handle of handles) {
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
      clientX >= point1.x &&
      clientX <= point2.x &&
      clientY >= point1.y &&
      clientY <= point2.y
    ) {
      // Determine if near any edge by checking against a margin.
      const nearLeft = Math.abs(clientX - point1.x) < margin;
      const nearRight = Math.abs(clientX - point2.x) < margin;
      const nearTop = Math.abs(clientY - point1.y) < margin;
      const nearBottom = Math.abs(clientY - point2.y) < margin;

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

  // Register the event listener
  document.addEventListener("mousemove", onMouseMove);

  // Return a cleanup function to remove the event listener when no longer needed.
  return () => {
    document.removeEventListener("mousemove", onMouseMove);
  };
}

export default drawSelection;
