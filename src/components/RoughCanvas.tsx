//@ts-nocheck
"use client"
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { useDrawing } from "@/context/DrawingContext";

const RoughCanvas = () => {
  const canvasRef = useRef(null);
  const { history, startDrawing, draw, stopDrawing, currentShape } = useDrawing();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rc = rough.canvas(canvas);

    const drawShape = (shape) => {
      if (shape.type === "rectangle") {

        let dashed = null;
        if (shape.strokeStyle === "dashed") {
          dashed = [10, 10]
          
        }
        else if(shape.strokeStyle === "dotted"){
          dashed = [5, 5]
        }
        else{
          dashed = null
        }

        rc.rectangle(shape.x, shape.y, shape.width, shape.height, {
          fill: shape.fill,
          fillStyle: "solid",
          stroke: shape.stroke,
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
              stroke: shape.stroke,
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      history.forEach(drawShape); // Draw saved history
      if (currentShape) drawShape(currentShape); // Draw real-time shape
    };

    let animationFrameId;
    const renderLoop = () => {
      redraw();
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [history, currentShape]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    startDrawing(offsetX, offsetY);
  };

  const handleMouseMove = (e) => {
    if (e.buttons !== 1) return; // Only draw when mouse is pressed
    const { offsetX, offsetY } = e.nativeEvent;
    draw(offsetX, offsetY);
  };

  const handleMouseUp = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    stopDrawing(offsetX, offsetY);
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
    />
  );
};

export default RoughCanvas;
