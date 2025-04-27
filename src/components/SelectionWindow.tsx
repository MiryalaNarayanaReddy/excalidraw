"use client"
import { FillColorSelection, StrokeColorSelection } from "@/components/ColorSelection";
import { StrokeStyleSection, StrokeWidthSelection } from "@/components/StrokeSelection";
import { OpacitySection } from "@/components/Opacity";

import { useDrawing } from "@/context/DrawingContext";
import { useEffect } from "react";
import { Shape } from "@/context/DrawingContext";

function SelectionWindow() {
    const context = useDrawing();
    
    if (!context) {
        return null;
    }

    const { 
        selectedObjectIndex, 
        history, 
        setHistory,
        selectedFill, setSelectedFill,
        selectedStroke, setSelectedStroke,
        selectedStrokeWidth, setSelectedStrokeWidth,
        selectedStrokeStyle, setSelectedStrokeStyle,
        selectedOpacity, setSelectedOpacity
    } = context;

    // Update selection window properties when a new shape is selected
    useEffect(() => {
        if (selectedObjectIndex !== null && history[selectedObjectIndex]) {
            const shape = history[selectedObjectIndex];
            setSelectedFill(shape.fill);
            setSelectedStroke(shape.stroke);
            setSelectedStrokeWidth(shape.strokeWidth);
            setSelectedStrokeStyle(shape.strokeStyle);
            setSelectedOpacity(shape.opacity);
        }
    }, [selectedObjectIndex, history]);

    // Update shape properties when selection window values change
    useEffect(() => {
        if (selectedObjectIndex !== null && history[selectedObjectIndex]) {
            setHistory((prev: Shape[]) => {
                const newHistory = [...prev];
                const shape = newHistory[selectedObjectIndex];
                shape.fill = selectedFill;
                shape.stroke = selectedStroke;
                shape.strokeWidth = selectedStrokeWidth;
                shape.strokeStyle = selectedStrokeStyle;
                shape.opacity = selectedOpacity;
                return newHistory;
            });
        }
    }, [selectedFill, selectedStroke, selectedStrokeWidth, selectedStrokeStyle, selectedOpacity]);

    if (selectedObjectIndex === null) {
        return null;
    }

    return (
        <div className="fixed left-10 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md shadow-lg rounded-lg px-6 py-3 flex space-x-4 z-50">
            <div className="flex flex-col gap-2 w-52">
                <div>Stroke</div>
                <StrokeColorSelection />
                <div>Background</div>
                <FillColorSelection />
                <div>Stroke Width</div>
                <StrokeWidthSelection />
                <div>Stroke Style</div>
                <StrokeStyleSection />
                <div>Opacity</div>
                <OpacitySection />
            </div>
        </div>
    );
}

export default SelectionWindow;