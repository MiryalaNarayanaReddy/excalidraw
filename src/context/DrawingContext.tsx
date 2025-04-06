//@ts-nocheck
"use client";
import { get } from "http";
import { createContext, useContext, useState } from "react";

import Rectangle from "@/components/shapes/rectangle";
import Elipse from "@/components/shapes/elipse";
import Line from "@/components/shapes/line";
import Pencil from "@/components/shapes/pencil";

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
      const pencil = new Pencil(
        [{ x: offsetX, y: offsetY }],
        selectedStroke,
        selectedFill,
        selectedStrokeWidth,
        selectedStrokeStyle,
        selectedSloppiness,
        selectedOpacity);
      setCurrentShape(pencil);

    } else if (mode === "rectangle") {
      setStartPoint({ x: offsetX, y: offsetY });
      const rect = new Rectangle(
        offsetX,
        offsetY,
        0,
        0,
         selectedStroke,
         selectedFill,
         selectedSloppiness,
         selectedStrokeWidth,
         selectedStrokeStyle,
         selectedOpacity);
      setCurrentShape(rect);
    }
    else if (mode === "elipse") {
      const elipse = new Elipse(
        offsetX,
        offsetY,
        0,
        0,
          selectedStroke,
          selectedFill,
          selectedSloppiness,
          selectedStrokeWidth,
          selectedStrokeStyle,
          selectedOpacity);
      setCurrentShape(elipse);
    }
    else if (mode === "line") {
      const line = new Line(
        { x: offsetX, y: offsetY },
        { x: offsetX, y: offsetY },
          selectedStroke,
          selectedFill,
          selectedStrokeWidth,
          selectedStrokeStyle,
          selectedSloppiness,
          selectedOpacity);
      setCurrentShape(line);
    }
    else if (mode === "pointer") {
      setStartPoint({ x: offsetX, y: offsetY });
      const rect = new Rectangle(
        offsetX,
        offsetY,
        0,
        0,
          selectedStroke,
          selectedFill,
          selectedSloppiness,
          selectedStrokeWidth,
          selectedStrokeStyle,
          selectedOpacity);
      setCurrentShape(rect);
    }

  };

  const draw = (offsetX, offsetY) => {
    if (!isDrawing || !currentShape) return;

    if (mode === "pencil") {
      const pencil = new Pencil(
        [...currentShape.points,
          { x: offsetX, y: offsetY }
        ],
        selectedStroke,
        selectedFill,
        selectedStrokeWidth,
        selectedStrokeStyle,
        selectedSloppiness,
        selectedOpacity);
      setCurrentShape(pencil);

    } else if (mode === "rectangle" && startPoint) {

      const rect = new Rectangle(
        Math.min(startPoint.x, offsetX),
        Math.min(startPoint.y, offsetY),
        Math.abs(offsetX - startPoint.x),
        Math.abs(offsetY - startPoint.y),
        selectedStroke,
        selectedFill,
        selectedSloppiness,
        selectedStrokeWidth,
        selectedStrokeStyle,
        selectedOpacity);
      setCurrentShape(rect);

    }
    else if (mode === "elipse" && startPoint) {
        const elipse = new Elipse(  
          Math.min(startPoint.x, offsetX),  
          Math.min(startPoint.y, offsetY),  
          Math.abs(offsetX - startPoint.x),  
          Math.abs(offsetY - startPoint.y),  
            selectedStroke,  
            selectedFill,  
            selectedSloppiness,  
            selectedStrokeWidth,  
            selectedStrokeStyle,  
            selectedOpacity);
        setCurrentShape(elipse);  
    }
    else if (mode === "line" && startPoint) {
      const line = new Line(
        { x: startPoint.x, y: startPoint.y },
        { x: offsetX, y: offsetY },
          selectedStroke,
          selectedFill,
          selectedStrokeWidth,
          selectedStrokeStyle,
          selectedSloppiness,
          selectedOpacity);
      setCurrentShape(line);
    }
    else if (mode === "pointer" && startPoint) {

      const rect = new Rectangle(
        Math.min(startPoint.x, offsetX),
        Math.min(startPoint.y, offsetY),
        Math.abs(offsetX - startPoint.x),
        Math.abs(offsetY - startPoint.y),
          "#2b7fff",
          "#60a5d3",
          0,
          1,
          "solid",
          30);
      setCurrentShape(rect);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentShape) {

      console.log(currentShape);

      if (mode === "rectangle"||mode === "elipse"||mode === "line"||mode === "pencil") {
        setHistory((prev) => [...prev, currentShape]);
        setCurrentShape(null);
        return;
      }
      
      setHistory((prev) => [...prev, currentShape]);

      setCurrentShape(null);
    }
  };

  return (
    <DrawingContext.Provider
      value={{ history, setHistory,startDrawing, draw, stopDrawing, mode, setMode, currentShape, selectedFill, setSelectedFill, selectedStroke, setSelectedStroke, selectedStrokeWidth, setSelectedStrokeWidth, selectedStrokeStyle, setSelectedStrokeStyle, selectedSloppiness, setSelectedSloppiness, selectedOpacity, setSelectedOpacity }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => useContext(DrawingContext);
