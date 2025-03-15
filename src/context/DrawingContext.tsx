//@ts-nocheck
"use client";
import { createContext, useContext, useState } from "react";

const DrawingContext = createContext(null);

export const DrawingProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("pencil");
  const [history, setHistory] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [startPoint, setStartPoint] = useState(null);

  const [selectedFill, setSelectedFill] = useState("#ffffff")
  const [selectedStroke, setSelectedStroke] = useState("#000000");

  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(1)
  const [selectedStrokeStyle, setSelectedStrokeStyle] = useState("solid")
  const [selectedSloppiness, setSelectedSloppiness] = useState(0)
  const [selectedOpacity, setSelectedOpacity] = useState(100)

  const startDrawing = (offsetX, offsetY) => {
    setIsDrawing(true);

    setStartPoint({ x: offsetX, y: offsetY });

    if (mode === "pencil") {
      setCurrentShape({
        type: "pencil",
        points: [{ x: offsetX, y: offsetY }],
        stroke: selectedStroke,
        fill: selectedFill,
        strokeWidth: selectedStrokeWidth,
        strokeStyle: selectedStrokeStyle,
        sloppiness: selectedSloppiness,
        opacity: selectedOpacity
      });
    } else if (mode === "rectangle") {
      setStartPoint({ x: offsetX, y: offsetY });
      setCurrentShape({
        type: "rectangle",
        x: offsetX,
        y: offsetY,
        width: 0,
        height: 0,
        stroke: selectedStroke,
        fill: selectedFill,
        roughness: selectedSloppiness,
        strokeWidth: selectedStrokeWidth,
        strokeStyle: selectedStrokeStyle,
        opacity: selectedOpacity
      });
    }
    else if(mode === "elipse"){
      setCurrentShape({
        type: "elipse",
        x: offsetX,
        y: offsetY,
        width: 0,
        height: 0,
        stroke: selectedStroke,
        fill: selectedFill,
        roughness: selectedSloppiness,
        strokeWidth: selectedStrokeWidth,
        strokeStyle: selectedStrokeStyle,
        opacity: selectedOpacity
      });
    }
    else if(mode === "line"){
      setCurrentShape({
        type: "line",
        points: [{ x: offsetX, y: offsetY }],
        stroke: selectedStroke,
        fill: selectedFill,
        strokeWidth: selectedStrokeWidth,
        strokeStyle: selectedStrokeStyle,
        sloppiness: selectedSloppiness,
        opacity: selectedOpacity
      });
    }
   
  };

  const draw = (offsetX, offsetY) => {
    if (!isDrawing || !currentShape) return;

    if (mode === "pencil") {
      setCurrentShape((prev) => ({
        ...prev,
        points: [...prev.points,
        { x: offsetX, y: offsetY }
        ],
      }));
    } else if (mode === "rectangle" && startPoint) {
      setCurrentShape({
        type: "rectangle",
        x: Math.min(startPoint.x, offsetX),
        y: Math.min(startPoint.y, offsetY),
        width: Math.abs(offsetX - startPoint.x),
        height: Math.abs(offsetY - startPoint.y),
        stroke: selectedStroke,
        fill: selectedFill,
        roughness: selectedSloppiness,
        strokeWidth: selectedStrokeWidth,
        strokeStyle: selectedStrokeStyle,
        opacity: selectedOpacity
      });
    }
    else if(mode === "elipse" && startPoint){
      setCurrentShape({
        type: "elipse",
        x: Math.min(startPoint.x, offsetX),
        y: Math.min(startPoint.y, offsetY),
        width: Math.abs(offsetX - startPoint.x),
        height: Math.abs(offsetY - startPoint.y),
        stroke: selectedStroke,
        fill: selectedFill,
        roughness: selectedSloppiness,
        strokeWidth: selectedStrokeWidth,
        strokeStyle: selectedStrokeStyle,
        opacity: selectedOpacity
      });
    }
    else if(mode === "line" && startPoint){
      setCurrentShape({
        type: "line",
        points: [
          { x: startPoint.x, y: startPoint.y },
          { x: offsetX, y: offsetY },
        ],
        stroke: selectedStroke,
        fill: selectedFill,
        strokeWidth: selectedStrokeWidth,
        strokeStyle: selectedStrokeStyle,
        sloppiness: selectedSloppiness,
        opacity: selectedOpacity
      });
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentShape) {
      setHistory((prev) => [...prev, currentShape]);
      setCurrentShape(null);
    }
  };

  return (
    <DrawingContext.Provider
      value={{ history, startDrawing, draw, stopDrawing, mode, setMode, currentShape, selectedFill, setSelectedFill, selectedStroke, setSelectedStroke, selectedStrokeWidth, setSelectedStrokeWidth, selectedStrokeStyle, setSelectedStrokeStyle, selectedSloppiness, setSelectedSloppiness, selectedOpacity, setSelectedOpacity }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => useContext(DrawingContext);
