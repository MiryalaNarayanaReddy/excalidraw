"use client";

import { useDrawing } from "@/context/DrawingContext";

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
        { key: "pointer", label: "Pointer" },
        { key: "pan", label: "✋ Pan" },
        { key: "pencil", label: "✏️ Pencil" },
        { key: "rectangle", label: "⬛ Rectangle" },
        { key: "elipse", label: "⬤ Elipse" },
        { key: "line", label: "➖ Line" },
      ].map(({ key, label }) => (
        <button
          key={key}
          className={`px-4 py-2 rounded-md shadow-md transition-all ${
            mode === key ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() =>handleModeChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Navbar;
