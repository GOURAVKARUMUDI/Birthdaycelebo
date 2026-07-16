"use client";

import React, { useState } from "react";

interface DndListProps<T> {
  items: T[];
  renderItem: (item: T, index: number, dragHandlers: Record<string, any>) => React.ReactNode;
  onReorder: (newItems: T[]) => void;
  className?: string;
}

export default function DndList<T>({ items, renderItem, onReorder, className = "" }: DndListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Perform swap locally for visual fluid feedback
    const reordered = [...items];
    const draggedItem = reordered[draggedIndex];
    reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    onReorder(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={className}>
      {items.map((item, index) => {
        const dragHandlers = {
          draggable: true,
          onDragStart: (e: React.DragEvent) => handleDragStart(e, index),
          onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
          onDragEnd: handleDragEnd,
        };

        return (
          <div
            key={(item as any).id || index}
            className={`transition-all duration-150 ${draggedIndex === index ? "opacity-40 scale-95 border-purple border border-dashed rounded-xl" : ""}`}
          >
            {renderItem(item, index, dragHandlers)}
          </div>
        );
      })}
    </div>
  );
}
