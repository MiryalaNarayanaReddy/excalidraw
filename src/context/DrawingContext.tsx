//@ts-nocheck
"use client";
import { get } from "http";
import { createContext, useContext, useState } from "react";

import Rectangle from "@/components/shapes/rectangle";
import Elipse from "@/components/shapes/elipse";
import Line from "@/components/shapes/line";
import Pencil from "@/components/shapes/pencil";

type Point = { x: number; y: number };
type Transform = { x: number; y: number; scale: number };
export type Shape = Rectangle | Elipse | Line | Pencil;

interface DrawingContextType {
  isDrawing: boolean;
  mode: string;
  history: Shape[];
  setHistory: (history: Shape[] | ((prev: Shape[]) => Shape[])) => void;
  currentShape: Shape | null;
  startPoint: Point | null;
  selectedFill: string;
  setSelectedFill: (color: string) => void;
  selectedStroke: string;
  setSelectedStroke: (color: string) => void;
  selectedStrokeWidth: number;
  setSelectedStrokeWidth: (width: number) => void;
  selectedStrokeStyle: string;
  setSelectedStrokeStyle: (style: string) => void;
  selectedSloppiness: number;
  setSelectedSloppiness: (sloppiness: number) => void;
  selectedOpacity: number;
  setSelectedOpacity: (opacity: number) => void;
  transform: Transform;
  setTransform: (transform: Transform) => void;
  selectedObjectIndex: number | null;
  setSelectedObjectIndex: (index: number | null) => void;
  startDrawing: (x: number, y: number) => void;
  draw: (x: number, y: number) => void;
  stopDrawing: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const DrawingContext = createContext<DrawingContextType | null>(null);

export const DrawingProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("pencil");
  const [history, setHistory] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [selectedFill, setSelectedFill] = useState("#ffffff")
  const [selectedStroke, setSelectedStroke] = useState("#000000");

  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(1)
  const [selectedStrokeStyle, setSelectedStrokeStyle] = useState("solid")
  const [selectedSloppiness, setSelectedSloppiness] = useState(0)
  const [selectedOpacity, setSelectedOpacity] = useState(100)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 }); 

  const [selectedObjectIndex, setSelectedObjectIndex] = useState<number | null>(null);

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
    } else if (mode === "eraser") {
      // For eraser, we don't need to create a new shape
      setCurrentShape(null);
      // Start erasing immediately
      setHistory(prev => {
        return prev.filter(shape => {
          if (shape instanceof Pencil) {
            return !shape.shouldErase(offsetX, offsetY);
          }
          return true;
        });
      });
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
    if (!isDrawing) return;

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
    } else if (mode === "eraser") {
      // Erase objects that are touched by the eraser
      setHistory(prev => {
        return prev.filter(shape => {
          if (shape instanceof Pencil) {
            return !shape.shouldErase(offsetX, offsetY);
          } else if (shape instanceof Rectangle) {
            return !shape.containsPoint(offsetX, offsetY);
          } else if (shape instanceof Elipse) {
            return !shape.containsPoint(offsetX, offsetY);
          } else if (shape instanceof Line) {
            return !shape.isNearPoint(offsetX, offsetY);
          }
          return true;
        });
      });
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
    else if (mode === "pointer" && startPoint && selectedObjectIndex !== null) {
      // Calculate the movement delta, taking into account the scale
      const dx = (offsetX - startPoint.x) / transform.scale;
      const dy = (offsetY - startPoint.y) / transform.scale;
      
      // Update the start point for the next movement
      setStartPoint({ x: offsetX, y: offsetY });
      
      // Move the selected shape
      setHistory(prev => {
        const newHistory = [...prev];
        const shape = newHistory[selectedObjectIndex];
        if (shape) {
          shape.move(startPoint.x, startPoint.y, offsetX, offsetY);
        }
        return newHistory;
      });
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const lastShape = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setUndoStack(prev => [...prev, lastShape]);
    }
  };

  const redo = () => {
    if (undoStack.length > 0) {
      const shapeToRedo = undoStack[undoStack.length - 1];
      setHistory(prev => [...prev, shapeToRedo]);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentShape) {
      if (mode === "rectangle" || mode === "elipse" || mode === "line" || mode === "pencil") {
        setHistory((prev) => [...prev, currentShape]);
        setCurrentShape(null);
        // Clear redo stack when new changes are made
        setRedoStack([]);
        // Automatically select the last drawn shape
        setSelectedObjectIndex(history.length);
        // Switch to pointer mode after drawing
        setMode("pointer");
        // Show selection box for the new shape
        const newShape = history[history.length];
        if (newShape) {
          const selectionBox = newShape.getSelectionBox();
          // You might want to store this in state or use it to draw the selection box
          console.log("Selection box for new shape:", selectionBox);
        }
        return;
      }
      
      setHistory((prev) => [...prev, currentShape]);
      setCurrentShape(null);
      // Clear redo stack when new changes are made
      setRedoStack([]);
      // Automatically select the last drawn shape
      setSelectedObjectIndex(history.length);
      // Switch to pointer mode after drawing
      setMode("pointer");
      // Show selection box for the new shape
      const newShape = history[history.length];
      if (newShape) {
        const selectionBox = newShape.getSelectionBox();
        // You might want to store this in state or use it to draw the selection box
        console.log("Selection box for new shape:", selectionBox);
      }
    }
  };

  return (
    <DrawingContext.Provider
      value={{ 
        history, setHistory, 
        startDrawing, draw, stopDrawing, 
        mode, setMode, 
        currentShape,
        undo, redo,
        canUndo: history.length > 0,
        canRedo: undoStack.length > 0,

        selectedFill, setSelectedFill, 
        selectedStroke, setSelectedStroke, 
        selectedStrokeWidth, setSelectedStrokeWidth, 
        selectedStrokeStyle, setSelectedStrokeStyle, 
        selectedSloppiness, setSelectedSloppiness, 
        selectedOpacity, setSelectedOpacity, 

        transform, setTransform,
        selectedObjectIndex, setSelectedObjectIndex
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => useContext(DrawingContext);
