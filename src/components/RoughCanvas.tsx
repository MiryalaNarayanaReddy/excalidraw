//@ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { useDrawing } from "@/context/DrawingContext";

const RoughCanvas = () => {
  const canvasRef = useRef(null);
  const { points, startDrawing, draw, stopDrawing, previewRectangle } = useDrawing();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", updateSize);
    updateSize(); // Set initial size

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rc = rough.canvas(canvas);
    const generator = rough.generator();

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.forEach((path) => {
        if (path.length === 5) {
          // Rectangle mode
          const rect = generator.polygon(path.map((p) => [p.x, p.y]), {
            roughness: 0,
            stroke: "black",
          });
          rc.draw(rect);
        } else {
          // Pencil mode
          for (let i = 0; i < path.length - 1; i++) {
            const line = generator.line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y, {
              roughness: 0,
              stroke: "black",
            });
            rc.draw(line);
          }
        }
      });

      // Draw preview rectangle in light blue
      if (previewRectangle) {
        ctx.strokeStyle = "lightblue";
        ctx.strokeRect(previewRectangle.x, previewRectangle.y, previewRectangle.width, previewRectangle.height);
      }
    };

    redraw();

    return () => {
      document.body.style.overflow = ""; // Restore scrolling
    };
  }, [points, previewRectangle]);

  const handleMouseDown = (e) => startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  const handleMouseMove = (e) => draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  const handleMouseUp = (e) => stopDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

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
