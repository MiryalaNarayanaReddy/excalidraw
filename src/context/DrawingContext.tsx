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

  const [selectedFill, setSelectedFill] = useState("green")
  const [selectedStroke, setSelectedStroke] = useState("black");

  const startDrawing = (offsetX, offsetY) => {
    setIsDrawing(true);

    if (mode === "pencil") {
      setCurrentShape({ type: "pencil", points: [{ x: offsetX, y: offsetY}], stroke: selectedStroke, fill: selectedFill });
    } else if (mode === "rectangle") {
      setStartPoint({ x: offsetX, y: offsetY });
      setCurrentShape({ type: "rectangle", x: offsetX, y: offsetY, width: 0, height: 0, stroke: selectedStroke, fill: selectedFill });
    }
  };

  const draw = (offsetX, offsetY) => {
    if (!isDrawing || !currentShape) return;

    if (mode === "pencil") {
      setCurrentShape((prev) => ({
        ...prev,
        points: [...prev.points, { x: offsetX, y: offsetY, stroke: selectedStroke, fill: selectedFill }],
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
      value={{ history, startDrawing, draw, stopDrawing, mode, setMode, currentShape, selectedFill,setSelectedFill, selectedStroke, setSelectedStroke }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => useContext(DrawingContext);
