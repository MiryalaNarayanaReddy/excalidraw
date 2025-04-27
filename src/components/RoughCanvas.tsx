//@ts-nocheck
"use client"
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { useDrawing } from "@/context/DrawingContext";
import drawSelection from "./selection";

import SelectionBox from "@/components/shapes/selection"

type Point = { x: number; y: number };


const RoughCanvas = () => {
  const canvasRef = useRef(null);
  const { mode, history,setHistory, startDrawing, draw, stopDrawing, currentShape,transform, selectedObjectIndex, setSelectedObjectIndex, setTransform } = useDrawing();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [selectionStartPoint, setSelectionStartPoint] = useState<Point | null>(null);


  const [selectionBoxType, setSelectionBoxType] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  }, []);

  // pan & zoom state
  
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

      history.forEach((shape) => {
        shape.draw(rc);
      });


      if (currentShape)
        currentShape.draw(rc);

      if (selectionBox)
        selectionBox.draw(rc);

    };

    redraw();

  }, [history, currentShape, transform, selectionBox]);

  // drawing vs pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "pan") {
      isPanning.current = true;
      document.body.style.cursor = "grabbing";
      panStart.current = { x: e.clientX, y: e.clientY };
    }
    else if (mode === "pointer") {
      const rect = canvasRef.current!.getBoundingClientRect();
      const worldX = (e.clientX - rect.left - transform.x) / transform.scale;
      const worldY = (e.clientY - rect.top - transform.y) / transform.scale;

      if (selectionBox) {
        const type = selectionBox.mouseOverHandle(worldX, worldY);

        if (type === "outside") {
          // Only clear selection if clicking outside the selection box
          setSelectionBox(null);
          setSelectedObjectIndex(null);
          setSelectionStartPoint(null);
          return;
        } else {
          setSelectionBoxType(type);
          setSelectionStartPoint({ x: worldX, y: worldY });
          return; // Maintain selection and handle the interaction
        }
      }

      let i = history.length - 1;
      let flag = false;

      while (i >= 0) {
        if (history[i].contains(worldX, worldY)) {
          setSelectedObjectIndex(i);
          setSelectionStartPoint({ x: worldX, y: worldY });

          let pts = history[i].getSelectionBox();
          let _selectionBox = new SelectionBox(pts.point1, pts.point2);
          setSelectionBox(_selectionBox);

          flag = true;
          break;
        }
        i--;
      }

      if (!flag) {
        setSelectionBox(null);
        setSelectedObjectIndex(null);
        setSelectionStartPoint(null);
      }
    }
    else {
      const rect = canvasRef.current!.getBoundingClientRect();
      const worldX = (e.clientX - rect.left - transform.x) / transform.scale;
      const worldY = (e.clientY - rect.top - transform.y) / transform.scale;
      startDrawing(worldX, worldY);
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === "pan" && isPanning.current) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      panStart.current = { x: e.clientX, y: e.clientY };
      setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
    }
    else if (mode === "pointer") {
      const rect = canvasRef.current!.getBoundingClientRect();
      const worldX = (e.clientX - rect.left - transform.x) / transform.scale;
      const worldY = (e.clientY - rect.top - transform.y) / transform.scale;

      if (selectionBox) {
        if (selectionBoxType === "inside") {
          const dx = worldX - selectionStartPoint.x;
          const dy = worldY - selectionStartPoint.y;
          
          setHistory((prev) => {
            let newHistory = [...prev];
            newHistory[selectedObjectIndex].move(selectionStartPoint.x, selectionStartPoint.y, worldX, worldY);
            return newHistory;
          });

          const shape = history[selectedObjectIndex];
          const pts = shape.getSelectionBox();
          selectionBox.updatePoints(pts.point1, pts.point2);
          
          setSelectionStartPoint({ x: worldX, y: worldY });
        } 
        else if (selectionBoxType && selectionBoxType !== "outside") {
          setHistory((prev) => {
            let newHistory = [...prev];
            const shape = newHistory[selectedObjectIndex];
            shape.resize(selectionBoxType, selectionStartPoint.x, selectionStartPoint.y, worldX, worldY);
            return newHistory;
          });
          
          const shape = history[selectedObjectIndex];
          const pts = shape.getSelectionBox();
          selectionBox.updatePoints(pts.point1, pts.point2);
          
          setSelectionStartPoint({ x: worldX, y: worldY });
        }
        return;
      }

      let flag = false;
      history.forEach((shape) => {
        if (shape.contains(worldX, worldY)) {
          flag = true;
        }
      });

      if (flag) {
        document.body.style.cursor = "move";
        return;
      } else {
        document.body.style.cursor = "default";
      }
    }
    else {
      if (e.buttons !== 1) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const worldX = (e.clientX - rect.left - transform.x) / transform.scale;
      const worldY = (e.clientY - rect.top - transform.y) / transform.scale;
      draw(worldX, worldY);
    }
  };
  const handleMouseUp = (e: React.MouseEvent) => {

    if(mode==="pointer"){
      
      // setSelectedObjectIndex(null);
      setSelectionStartPoint(null);
      setSelectionBoxType(null);
  
    
    }
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
