//@ts-nocheck
"use client"
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { useDrawing } from "@/context/DrawingContext";
import drawSelection from "./selection";


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
  const {mode, history, startDrawing, draw, stopDrawing, currentShape, selectedObjects, setSelectedObjects, selectionBox, setSelectionBox } = useDrawing();
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

      history.forEach((shape)=>{
        shape.draw(rc);
      });

      
      if (currentShape) currentShape.draw(rc);

      // if (selectedObjects.length && selectionBox) {
      //   drawSelection(selectionBox.point1, selectionBox.point2, rc);
      //   if (selectedObjects.length > 1)
      //     selectedObjects.forEach(drawShape);
      // }
    };

    redraw();

  }, [history, currentShape, transform, selectedObjects, selectionBox]);

  // drawing vs pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "pan") {
      isPanning.current = true;
      document.body.style.cursor = "grabbing";
      panStart.current = { x: e.clientX, y: e.clientY };
    }
    
    else {
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
    } 
    else  if(mode === "pointer"){
      // check if cursor is in a shape 
      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < history.length; i++) {
        const shape = history[i]; 

        if(shape.type === "rectangle"){
          // check if cursor is inside rectangle 
          if(x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height){
            document.body.style.cursor = "move";
            return;
          }
        }
        else if(shape.type === "elipse"){
          // check if cursor is inside elipse 
          if(x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height){
            document.body.style.cursor = "move";
            return;
          }
        }
        else if (shape.type === "line") {
          // check if cursor is on or near a line

          // ab distance between points +2 = ap+bp distances 
          const ap = Math.abs(shape.points[0].x - x) + Math.abs(shape.points[0].y - y);
          const bp = Math.abs(shape.points[1].x - x) + Math.abs(shape.points[1].y - y);
          const ab = Math.abs(shape.points[0].x - shape.points[1].x) + Math.abs(shape.points[0].y - shape.points[1].y); 

          if(ap+bp - ab <= 0.3){
            document.body.style.cursor = "move";
            return;
          }
        
        }
        else if (shape.type === "pencil") {
          // if cursor is near a point, set cursor to move crosshair 
          for (let j = 0; j < shape.points.length; j++) {
            if (x >= shape.points[j].x && x <= shape.points[j].x + 1 && y >= shape.points[j].y && y <= shape.points[j].y + 1) {
              document.body.style.cursor = "move";
              return;
            }
          }
        }
          
      }
      document.body.style.cursor = "default";
    }
    
    
    else {
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
      document.body.style.cursor = "grab";
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
