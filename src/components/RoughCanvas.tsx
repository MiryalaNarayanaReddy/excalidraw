//@ts-nocheck
"use client"
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { useDrawing } from "@/context/DrawingContext";
import drawSelection from "./selection";


function hex2rgba(hexa, opacity) {
  let r = parseInt(hexa.slice(1, 3), 16);
  let g = parseInt(hexa.slice(3, 5), 16);
  let b = parseInt(hexa.slice(5, 7), 16);
  let a = opacity;
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}



function selectionRect(canvas, x, y, width, height, color) {
  // ligh sky blue background border light sky blue border 

  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}


function selectionBox(canvas, x, y, width, height, color) {
  // dotted border light sky blue border
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
}





const RoughCanvas = () => {
  const canvasRef = useRef(null);
  const { history, startDrawing, draw, stopDrawing, currentShape, selectedObjects, setSelectedObjects, selectionBox, setSelectionBox } = useDrawing();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const update = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  // pan & zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  // main render loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rc = rough.canvas(canvas);

    const drawShape = (shape) => {
      if (shape.type === "rectangle") {

        let dashed = null;
        if (shape.strokeStyle === "dashed") {
          dashed = [10, 10]
        }
        else if (shape.strokeStyle === "dotted") {
          dashed = [5, 5]
        }
        else {
          dashed = null
        }

        rc.rectangle(shape.x, shape.y, shape.width, shape.height, {
          fill: hex2rgba(shape.fill, shape.opacity / 100),
          fillStyle: "solid",
          stroke: hex2rgba(shape.stroke, shape.opacity / 100),
          strokeWidth: shape.strokeWidth,
          roughness: shape.roughness,
          strokeLineDash: dashed,
        });
      } else if (shape.type === "pencil") {

        let dashed = null;
        if (shape.strokeStyle === "dashed") {
          dashed = [10, 10]

        }
        else if (shape.strokeStyle === "dotted") {
          dashed = [5, 5]
        }
        else {
          dashed = null
        }


        const generator = rough.generator();
        const points = shape.points.map((point) => [point.x, point.y]);
        for (let i = 0; i < points.length - 1; i++) {
          const line = generator.line(
            points[i][0],
            points[i][1],
            points[i + 1][0],
            points[i + 1][1],
            {
              stroke: hex2rgba(shape.stroke, shape.opacity / 100),
              strokeWidth: shape.strokeWidth,
              roughness: shape.sloppiness,
              strokeLineDash: dashed,
            }
          );
          rc.draw(line);
        }
      }
      else if (shape.type === "elipse") {

        let dashed = null;
        if (shape.strokeStyle === "dashed") {
          dashed = [10, 10]

        }
        else if (shape.strokeStyle === "dotted") {
          dashed = [5, 5]
        }
        else {
          dashed = null
        }

        rc.ellipse(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width, shape.height, {
          fill: hex2rgba(shape.fill, shape.opacity / 100),
          fillStyle: "solid",
          stroke: hex2rgba(shape.stroke, shape.opacity / 100),
          strokeWidth: shape.strokeWidth,
          roughness: shape.roughness,
          strokeLineDash: dashed,
        });
      }
      else if (shape.type === "line") {
        let dashed = null;
        if (shape.strokeStyle === "dashed") {
          dashed = [10, 10]

        }
        else if (shape.strokeStyle === "dotted") {
          dashed = [5, 5]
        }
        else {
          dashed = null
        }

        const generator = rough.generator();
        const points = shape.points.map((point) => [point.x, point.y]);
        for (let i = 0; i < points.length - 1; i++) {
          const line = generator.line(
            points[i][0],
            points[i][1],
            points[i + 1][0],
            points[i + 1][1],
            {
              stroke: hex2rgba(shape.stroke, shape.opacity / 100),
              strokeWidth: shape.strokeWidth,
              roughness: shape.sloppiness,
              strokeLineDash: dashed,
            }
          );
          rc.draw(line);
        }
      }
    };

    // console.log(history)

    const redraw = () => {
      // apply transform
      ctx.setTransform(
        transform.scale,
        0,
        0,
        transform.scale,
        transform.x,
        transform.y
      );
      // clear in world coords
      ctx.clearRect(
        -transform.x / transform.scale,
        -transform.y / transform.scale,
        canvas.width / transform.scale,
        canvas.height / transform.scale
      );

      history.forEach(drawShape);
      if (currentShape) drawShape(currentShape);

      if (selectedObjects.length && selectionBox) {
        drawSelection(selectionBox.point1, selectionBox.point2, rc);
        if (selectedObjects.length > 1)
          selectedObjects.forEach(drawShape);
      }
    };

    let id = requestAnimationFrame(function loop() {
      redraw();
      id = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
  }, [history, currentShape, transform, selectedObjects, selectionBox]);

  // drawing vs pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "pan") {
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
    } else {
      const { offsetX, offsetY } = e.nativeEvent;
      startDrawing(
        (offsetX - transform.x) / transform.scale,
        (offsetY - transform.y) / transform.scale
      );
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === "pan" && isPanning.current) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      panStart.current = { x: e.clientX, y: e.clientY };
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
    } else {
      if (e.buttons !== 1) return;
      const { offsetX, offsetY } = e.nativeEvent;
      draw(
        (offsetX - transform.x) / transform.scale,
        (offsetY - transform.y) / transform.scale
      );
    }
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (mode === "pan") {
      isPanning.current = false;
    } else {
      const { offsetX, offsetY } = e.nativeEvent;
      stopDrawing(
        (offsetX - transform.x) / transform.scale,
        (offsetY - transform.y) / transform.scale
      );
    }
  };

  // wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    // world coords of mouse
    const wx = (e.clientX - rect.left - transform.x) / transform.scale;
    const wy = (e.clientY - rect.top - transform.y) / transform.scale;
    const delta = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.1, transform.scale * (1 + delta)), 10);
    // recalc translation so zoom centers on mouse
    const nx = e.clientX - rect.left - wx * newScale;
    const ny = e.clientY - rect.top - wy * newScale;
    setTransform({ x: nx, y: ny, scale: newScale });
  };

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="absolute top-0 left-0 w-full h-full bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    />
  );
};

export default RoughCanvas;
