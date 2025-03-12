//@ts-nocheck
"use client";

import { createContext, useContext, useState } from "react";

const DrawingContext = createContext(null);

export const DrawingProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]); // Stores all drawings
  const [mode, setMode] = useState("pencil"); // Toggle between "pencil" & "rectangle"
  const [startPoint, setStartPoint] = useState(null);
  const [previewRectangle, setPreviewRectangle] = useState(null); // Temporary preview rectangle

  const startDrawing = (offsetX, offsetY) => {
    setIsDrawing(true);
    if (mode === "pencil") {
      setPoints((prev) => [...prev, [{ x: offsetX, y: offsetY }]]);
    } else if (mode === "rectangle") {
      setStartPoint({ x: offsetX, y: offsetY });
    }
  };

  const draw = (offsetX, offsetY) => {
    if (!isDrawing) return;
    if (mode === "pencil") {
      setPoints((prev) => {
        const newPoints = [...prev];
        newPoints[newPoints.length - 1].push({ x: offsetX, y: offsetY });
        return newPoints;
      });
    } else if (mode === "rectangle" && startPoint) {
      setPreviewRectangle({
        x: startPoint.x,
        y: startPoint.y,
        width: offsetX - startPoint.x,
        height: offsetY - startPoint.y,
      });
    }
  };

  const stopDrawing = (offsetX, offsetY) => {
    setIsDrawing(false);
    if (mode === "rectangle" && startPoint) {
      setPoints((prev) => [
        ...prev,
        [
          { x: startPoint.x, y: startPoint.y },
          { x: offsetX, y: startPoint.y },
          { x: offsetX, y: offsetY },
          { x: startPoint.x, y: offsetY },
          { x: startPoint.x, y: startPoint.y }, // Closing the rectangle
        ],
      ]);
      setStartPoint(null);
      setPreviewRectangle(null);
    }
  };

  return (
    <DrawingContext.Provider value={{ points, startDrawing, draw, stopDrawing, mode, setMode, previewRectangle }}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => useContext(DrawingContext);
