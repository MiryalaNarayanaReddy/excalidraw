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
  const { mode, history,setHistory, startDrawing, draw, stopDrawing, currentShape, selectedObjects, setSelectedObjects } = useDrawing();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [selectionStartPoint, setSelectionStartPoint] = useState<Point | null>(null);

  const [selectedObjectIndex, setSelectedObjectIndex] = useState<number | null>(null);
  const [selectionBoxType, setSelectionBoxType] = useState<string | null>(null);

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

      history.forEach((shape) => {
        shape.draw(rc);
      });


      if (currentShape)
        currentShape.draw(rc);

      if (selectionBox)
        selectionBox.draw(rc);

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
    else if (mode === "pointer") {
      let targetPoint = { x: e.clientX - transform.x, y: e.clientY - transform.y };

      if (selectionBox) {
        const type = selectionBox.mouseOverHandle(e.clientX, e.clientY);

        if (type == "outside") {
          setSelectionBox(prev => null);
          setSelectionStartPoint(prev => null);
          setSelectedObjectIndex(prev => null);
          return;
        }
        else {
          setSelectionBoxType(prev => type);
          setSelectionStartPoint(prev => {
            return { x: e.clientX , y: e.clientY  };
          });
          return;
        }
      }

      let i = history.length - 1;
      let flag = false;


      while (i >= 0) {
        if (history[i].contains(targetPoint.x, targetPoint.y)) {

          setSelectedObjectIndex(i);
          setSelectionStartPoint(prev => targetPoint);

          let pts = history[i].getSelectionBox()
          let _selectionBox = new SelectionBox(pts.point1, pts.point2);

          setSelectionBox(prev => _selectionBox);

          flag = true;
          break;
        }
        i--;
      }

      if (flag) {
        document.body.style.cursor = "move";
        return;
      }
      else {
        document.body.style.cursor = "default";
        setSelectionBox(null);
        setSelectedObjectIndex(null);
      }

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
    else if (mode === "pointer") {
      // check if cursor is in a shape 
      const x = e.clientX - transform.x;
      const y = e.clientY - transform.y;



      if (selectionBox) {

        if (selectionBoxType == "inside") {

          setHistory((prev) => {
            let newHistory = [...prev];
            newHistory[selectedObjectIndex].move(selectionStartPoint.x, selectionStartPoint.y, x, y);
            return newHistory;
          })
          
          setSelectionStartPoint(prev => {
            return { x: e.clientX, y: e.clientY };
          });
        }
        return
      }

      let flag = false;

      history.forEach((shape) => {

        if (shape.contains(x, y)) {
          flag = true;
        }
      })

      if (flag) {
        document.body.style.cursor = "move";
        return;
      }
      else {
        document.body.style.cursor = "default";
      }
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
