//@ts-nocheck
"use client"
import { useState } from "react"
import { useDrawing } from "@/context/DrawingContext"

function FillColorSelection() {

    const { selectedFill, setSelectedFill } = useDrawing()

    const [colors, setColors] = useState<{ name: string, color: string }[]>([

        { name: "red", color: "#ff0000" },
        { name: "green", color: "#00ff00" },
        { name: "blue", color: "#0000ff" },
        { name: "yellow", color: "#ffff00" },
        { name: "purple", color: "#ff00ff" },
        { name: "orange", color: "#ff8000" },
        { name: "black", color: "#000000" },
        { name: "white", color: "#ffffff" },
        { name: "gray", color: "#808080" },
        { name: "pink", color: "#ffc0cb" },
        { name: "brown", color: "#a52a2a" },
        { name: "cyan", color: "#00ffff" },
        { name: "lime", color: "#00ff00" },
        { name: "maroon", color: "#800000" },
        { name: "navy", color: "#000080" },
        { name: "olive", color: "#808000" },
        { name: "teal", color: "#008080" },
        { name: "silver", color: "#c0c0c0" }
    ])

    return (
        <div className="flex flex-row justify-start items-center gap-2 flex-wrap">

            {colors.map((color) => (
                <div key={color.name} className={` flex flex-row justify-center items-center p-[1px] ${selectedFill === color.color ? "border-1  border-sky-600" : ""}`}>

                    <button
                        className="w-5 h-5 rounded-md m-0 p-0 border-1 hover:cursor-pointer"
                        key={color.name}
                        onClick={() => setSelectedFill(color.color)}
                        style={{ backgroundColor: color.color }}
                    >
                        {/* {color.name} */}
                    </button>
                </div>
            ))}
        </div>
    )

}



function StrokeColorSelection() {
    const { selectedStroke, setSelectedStroke } = useDrawing()

    const [colors, setColors] = useState<{ name: string, color: string }[]>([

        { name: "red", color: "#ff0000" },
        { name: "green", color: "#00ff00" },
        { name: "blue", color: "#0000ff" },
        { name: "yellow", color: "#ffff00" },
        { name: "purple", color: "#ff00ff" },
        { name: "orange", color: "#ff8000" },
        { name: "black", color: "#000000" },
        { name: "white", color: "#ffffff" },
        { name: "gray", color: "#808080" },
        { name: "pink", color: "#ffc0cb" },
        { name: "brown", color: "#a52a2a" },
        { name: "cyan", color: "#00ffff" },
        { name: "lime", color: "#00ff00" },
        { name: "maroon", color: "#800000" },
        { name: "navy", color: "#000080" },
        { name: "olive", color: "#808000" },
        { name: "teal", color: "#008080" },
        { name: "silver", color: "#c0c0c0" }
    ])
    return (

        <div className="flex flex-row justify-start items-center gap-2 flex-wrap">
            {colors.map((color) => (
                <div key={color.name} className={` flex flex-row justify-center items-center p-[1px] ${selectedStroke === color.color ? "border-1  border-sky-600" : ""}`}>
                    <button className="w-5 h-5 rounded-md m-0 p-0 border-1 hover:cursor-pointer"
                        key={color.name}
                        onClick={() => setSelectedStroke(color.color)}
                        style={{ backgroundColor: color.color, borderColor: color.color }}
                    >
                        {/* {color.name} */}
                    </button>
                </div>
            ))}
        </div>
    )
}

export {
    FillColorSelection,
    StrokeColorSelection
};









