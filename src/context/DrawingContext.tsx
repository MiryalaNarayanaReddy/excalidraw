//@ts-nocheck
"use client";
import { get } from "http";
import { createContext, useContext, useState } from "react";

import Rectangle from "@/components/shapes/rectangle";
import Elipse from "@/components/shapes/elipse";
import Line from "@/components/shapes/line";
import Pencil from "@/components/shapes/pencil";

const DrawingContext = createContext(null);


function getSelectionRect(currentShape) {

  let rect = {
    type: "rectangle",
    x: currentShape.x,
    y: currentShape.y,
    width: currentShape.width,
    height: currentShape.height,
    stroke: "#2b7fff",
    fill: "#60a5d3",
    roughness: 0,
    strokeWidth: 1,
    strokeStyle: "solid",
    opacity: 30
  };

  let padding = 5;

  if (currentShape.type === "rectangle") {

    rect.x = currentShape.x - padding;
    rect.y = currentShape.y - padding;
    rect.width = currentShape.width + padding * 2;
    rect.height = currentShape.height + padding * 2;
  }
  else if (currentShape.type === "elipse") {
    rect.x = currentShape.x - padding;
    rect.y = currentShape.y - padding;
    rect.width = currentShape.width + padding * 2;
    rect.height = currentShape.height + padding * 2;
  }
  else if (currentShape.type === "line") {
    rect.x = Math.min(currentShape.points[0].x, currentShape.points[1].x) - padding;
    rect.y = Math.min(currentShape.points[0].y, currentShape.points[1].y) - padding;
    rect.width = Math.abs(currentShape.points[0].x - currentShape.points[1].x) + padding * 2;
    rect.height = Math.abs(currentShape.points[0].y - currentShape.points[1].y) + padding * 2;
  }
  else if (currentShape.type === "pencil") {
    // get min and max x and y
    let minX = currentShape.points[0].x;
    let maxX = currentShape.points[0].x;
    let minY = currentShape.points[0].y;
    let maxY = currentShape.points[0].y;

    for (let i = 1; i < currentShape.points.length; i++) {
      if (currentShape.points[i].x < minX) {
        minX = currentShape.points[i].x;
      }
      else if (currentShape.points[i].x > maxX) {
        maxX = currentShape.points[i].x;
      }

      if (currentShape.points[i].y < minY) {
        minY = currentShape.points[i].y;
      }
      else if (currentShape.points[i].y > maxY) {
        maxY = currentShape.points[i].y;
      }
    }


    if (minX === maxX) {
      minX -= padding;
      maxX += padding;
    }
    else if (minY === maxY) {
      minY -= padding;
      maxY += padding;
    }

    rect.x = minX;
    rect.y = minY;
    rect.width = maxX - minX;
    rect.height = maxY - minY;
  }


  return rect;


}

function getSelectionBox(selectionRects) {

  let point1 = {
    x: selectionRects[0].x,
    y: selectionRects[0].y
  };

  let point2 = {
    x: selectionRects[0].x + selectionRects[0].width,
    y: selectionRects[0].y + selectionRects[0].height
  };


  for (let i = 1; i < selectionRects.length; i++) {
    point1.x = Math.min(point1.x, selectionRects[i].x);
    point1.y = Math.min(point1.y, selectionRects[i].y);
    point2.x = Math.max(point2.x, selectionRects[i].x + selectionRects[i].width);
    point2.y = Math.max(point2.y, selectionRects[i].y + selectionRects[i].height);
  }

  if (point1.x === point2.x) {
    point1.x -= 1;
    point2.x += 1;
  }
  else if (point1.y === point2.y) {
    point1.y -= 1;
    point2.y += 1;
  }


  let padding = 5;

  point1.x = point1.x - padding;
  point1.y = point1.y - padding;

  point2.x = point2.x + padding;
  point2.y = point2.y + padding;

  return {
    point1,
    point2,
  }

}

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


  const [selectedObjects, setSelectedObjects] = useState([])

  const [selectionBox, setSelectionBox] = useState(null);

  const startDrawing = (offsetX, offsetY) => {
    setIsDrawing(true);
    setSelectedObjects(prev => []);
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
      // setCurrentShape((prev) => ({
      //   ...prev,
      //   points: [...prev.points,
      //   { x: offsetX, y: offsetY }
      //   ],
      // }));

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

      if(mode === "pointer"){
        setCurrentShape(null);
        return;
      }
      

      // if (mode === "pointer") {
      //   // set all objects inside the rectangle to be selected

      //   const x = currentShape.x;
      //   const y = currentShape.y;
      //   const width = currentShape.width;
      //   const height = currentShape.height;


      //   if(width === 0 || height === 0){
      //     setCurrentShape(null);
      //     return;
      //   }
      //   const _selectedObjects = [];

      //   for (let i = 0; i < history.length; i++) {
      //     const shape = history[i];


      //     if (shape.type === "rectangle") {
      //       // check if rectangle is inside the current rectangle 
      //       if (shape.x >= x && shape.x <= x + width && shape.y >= y && shape.y <= y + height) {
      //         _selectedObjects.push(getSelectionRect(shape));
      //       }
      //     }
      //     else if (shape.type === "elipse") {
      //       // check if elipse is inside the current rectangle 
      //       if (shape.x >= x && shape.x <= x + width && shape.y >= y && shape.y <= y + height) {
      //         _selectedObjects.push(getSelectionRect(shape));
      //       }
      //     }
      //     else if (shape.type === "line") {
      //       // check if line is inside the current rectangle 
      //       if (shape.points[0].x >= x && shape.points[0].x <= x + width && shape.points[0].y >= y && shape.points[0].y <= y + height) {
      //         _selectedObjects.push(getSelectionRect(shape));
      //       }
      //       if (shape.points[1].x >= x && shape.points[1].x <= x + width && shape.points[1].y >= y && shape.points[1].y <= y + height) {
      //         _selectedObjects.push(getSelectionRect(shape));
      //       }
      //     }
      //     else if (shape.type === "pencil") {
      //       // if even one point is outside the rectangle, then the whole shape is outside the rectangle

      //       let inside = true;
      //       for (let j = 0; j < shape.points.length; j++) {
      //         if (shape.points[j].x >= x && shape.points[j].x <= x + width && shape.points[j].y >= y && shape.points[j].y <= y + height) {

      //           inside = false;
      //           break;
      //         }
      //       }

      //       if (inside) {
      //         _selectedObjects.push(getSelectionRect(shape));
      //       }
      //     }

      //   }
      //   console.log(_selectedObjects);
      //   setSelectedObjects(prev => [..._selectedObjects]);

      //   if(_selectedObjects.length === 0){
      //     setSelectionBox(null);
      //     return;
      //   }
      //   setSelectionBox(prev=>getSelectionBox(_selectedObjects));

      //   setCurrentShape(null);

      // }
      // else {
      setHistory((prev) => [...prev, currentShape]);
      // }
      setCurrentShape(null);
    }
  };

  return (
    <DrawingContext.Provider
      value={{ history, startDrawing, draw, stopDrawing, mode, setMode, currentShape, selectedFill, setSelectedFill, selectedStroke, setSelectedStroke, selectedStrokeWidth, setSelectedStrokeWidth, selectedStrokeStyle, setSelectedStrokeStyle, selectedSloppiness, setSelectedSloppiness, selectedOpacity, setSelectedOpacity, selectedObjects, setSelectedObjects, selectionBox, setSelectionBox }}
    >
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawing = () => useContext(DrawingContext);
