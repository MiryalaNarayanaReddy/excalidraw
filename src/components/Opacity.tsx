//@ts-nocheck
"use client"
import { useState } from "react"
import { useDrawing } from "@/context/DrawingContext"

function OpacitySection() {
    const { selectedOpacity, setSelectedOpacity } = useDrawing()
    
    const handleChange = (e) => {
        setSelectedOpacity(Number(e.target.value))
    }

    return (
        <div className="flex flex-col items-center gap-y-4 w-full relative">
            
            <input 
                type="range" 
                min="0" 
                max="100" 
                step="10" 
                value={selectedOpacity} 
                onChange={handleChange} 
                className="w-full cursor-pointer appearance-none bg-gray-300 h-2 rounded-lg focus:outline-none" 
                style={{
                    background: `linear-gradient(to right, blue ${selectedOpacity}%, gray ${selectedOpacity}%)`
                }}
            />
            <div className="relative w-full flex justify-between text-sm text-gray-600">
                <span>0</span>

                {
                    selectedOpacity>0 && selectedOpacity < 100 &&
                    <div className="relative w-full">
                <span 
                    className="absolute text-sm text-gray-600 "
                    style={{ 
                        left: `calc(${selectedOpacity}%)`,
                    }}
                    >
                    {selectedOpacity}
                </span>
            </div>
                }
                <span>100</span>
            </div>
        </div>
    )
}

export {
    OpacitySection
};
