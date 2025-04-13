"use client";

import { Minus, Plus } from "lucide-react";
import { useDrawing } from "@/context/DrawingContext";

const ZoomSelection = () => {
    // @ts-ignore

    const { transform, setTransform } = useDrawing();


    const resetZoom = () => {
        setTransform({...transform, scale: 1});
        
    }

    const handleZoomIn = () => {
        setTransform({...transform, scale: transform.scale + 0.1});
    }

    const handleZoomOut = () => {
        setTransform({...transform, scale: transform.scale - 0.1});
    }

    return (
        <div className="flex flex-row justify-center items-center gap-2 bg-violet-100">
            <button className="w-10 h-10 flex justify-center items-center rounded-md m-0 p-0 hover:cursor-pointer"
                title="Zoom Out"
                onClick={handleZoomOut}
            >
                <Minus />
            </button>
            <button className="w-20 h-10 rounded-md m-0 p-0 hover:cursor-pointer"
                title="Reset Zoom"
                onClick={resetZoom}
            >
                {Math.round(transform.scale * 100)}%
            </button>
            <button className="w-10 h-10 flex justify-center items-center rounded-md m-0 p-0 hover:cursor-pointer"
                title="Zoom In"
                onClick={handleZoomIn}
            >
                <Plus />
            </button>
        </div>

    )


}


export default ZoomSelection;