"use client";

import { Undo2, Redo2 } from "lucide-react";
import { useDrawing } from "@/context/DrawingContext";

const UndoRedo = () => {
    //@ts-ignore
    const { undo, redo, canUndo, canRedo } = useDrawing();

    return (
        <div className="flex flex-row justify-center items-center gap-2 bg-violet-100">
            <button 
                className={`w-10 h-10 flex justify-center items-center rounded-md m-0 p-0 hover:cursor-pointer ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Undo"
                onClick={undo}
                disabled={!canUndo}
            >
                <Undo2 />
            </button>
            <button 
                className={`w-10 h-10 flex justify-center items-center rounded-md m-0 p-0 hover:cursor-pointer ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Redo"
                onClick={redo}
                disabled={!canRedo}
            >
                <Redo2 />
            </button>
        </div>
    );
};

export default UndoRedo; 