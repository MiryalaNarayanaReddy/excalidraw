"use client";

import { useDrawing } from "@/context/DrawingContext";
import { Square } from "lucide-react";
import { Hand } from "lucide-react";
import { Pencil } from "lucide-react";
import { Eraser } from "lucide-react";
import { Minus } from "lucide-react";
import { Circle } from "lucide-react";
import { MousePointer } from "lucide-react";

const Navbar = () => {
  // @ts-ignore
  const { mode, setMode } = useDrawing();

  //@ts-ignore
  const handleModeChange = (key)=>{

    if(key=="pan"){
      document.body.style.cursor = "grab";
    }
    else{
      document.body.style.cursor = "default";
    }

    setMode(key);

  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md shadow-lg rounded-lg px-6 py-3 flex space-x-4 z-50">
      {[
        { key: "pan", label: "Hand", icon: <Hand /> },
        { key: "pointer", label: "Pointer", icon: <MousePointer /> },
        { key: "rectangle", label: "Rectangle", icon: <Square /> },
        { key: "elipse", label: "Circle", icon: <Circle /> },
        { key: "line", label: "Line", icon: <Minus /> },  
        { key: "pencil", label: "Draw", icon: <Pencil /> },
        { key: "eraser", label: "Eraser", icon: <Eraser /> },
       
      ].map(({ key, label, icon }) => (
        <button
          key={key}
          title={label}
          className={`px-2 py-2 rounded-lg transition-all cursor-pointer ${
            mode === key ? "bg-violet-200" : "hover:bg-violet-100"
          }`}
          onClick={() =>handleModeChange(key)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default Navbar;
