//@ts-nocheck
"use client";
import { useDrawing } from "@/context/DrawingContext";

import { useState } from "react";

function StrokeWidthSelection() {
    const { selectedStrokeWidth, setSelectedStrokeWidth } = useDrawing();

    const [strokeWidths, setStrokeWidths] = useState([1, 2, 3])

    const [cssStroke, setCssStroke] = useState(["h-[1px]", "h-[2px]", "h-[3px]"])

    return (
        <div className="flex flex-row gap-4">

            {
                strokeWidths.map((w, i) => (
                    <div className={`flex flex-row justify-center items-center rounded-md h-10 w-10  ${selectedStrokeWidth === w ? "bg-violet-300" : "bg-gray-200"} hover:cursor-pointer`}
                    key={i}
                    onClick={() => setSelectedStrokeWidth(w)}
                    >

                        <div className={`w-5 ${cssStroke[i]} bg-black`}>
                        </div>

                    </div>
                ))
            }

        </div>
    )

}


function StrokeStyleSection() {

    const { selectedStrokeStyle, setSelectedStrokeStyle } = useDrawing()

    const [strokeStyles, setStrokeStyles] = useState(["solid", "dashed","dotted"])

    const [cssStrokeStyle, setCssStrokeStyle] = useState(["border-solid", "border-dashed", "border-dotted"])

    return (
        <div className="flex flex-row gap-4">

            {
                strokeStyles.map((s, i) => (
                    <div className={`flex flex-row justify-center items-center rounded-md h-10 w-10  ${selectedStrokeStyle === s ? "bg-violet-300" : "bg-gray-200"} hover:cursor-pointer`}
                    key={i}
                    onClick={() => setSelectedStrokeStyle(s)}
                    >

                        <div className={`w-5 border-t-2  ${cssStrokeStyle[i]}`}>
                        </div>

                    </div>
                ))
            }

        </div>
    )   

}

// function SloppinessSection() {
//     const { selectedSloppiness, setSelectedSloppiness } = useDrawing()
    
//     // sloppiness is roughness 
//     // 0 is smooth, 1 is rough
//     const [sloppiness, setSloppiness] = useState([0, 0.5, 1])

// }

export {
    StrokeWidthSelection,
    StrokeStyleSection,
    // SloppinessSection
};