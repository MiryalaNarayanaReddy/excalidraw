"use client";
import  {useDrawing}  from "@/context/DrawingContext";

const Navbar = () => {
  //@ts-ignore
  const { mode, setMode } = useDrawing();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md shadow-lg rounded-lg px-6 py-3 flex space-x-4 z-50">
    
        <button
          className={`px-4 py-2 w-fit rounded-md shadow-md transition-all ${mode === "pencil" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          onClick={() => setMode("pencil")}
        >
          ✏️ Pencil
        </button>
        <button
          className={`px-4 py-2 w-fit rounded-md shadow-md transition-all ${mode === "rectangle" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          onClick={() => setMode("rectangle")}
        >
          ⬛ Rectangle
        </button>
  
    </div>
  );
};

export default Navbar;
