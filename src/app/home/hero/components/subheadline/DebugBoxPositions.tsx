'use client';

import React from 'react';

interface BoxPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DebugBoxPositionsProps {
  boxPositions: BoxPosition[];
  connections: {from: number, to: number}[];
}

export default function DebugBoxPositions({
  boxPositions,
  connections
}: DebugBoxPositionsProps) {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-0 left-0 bg-black bg-opacity-80 text-white p-4 z-50 max-w-xs overflow-auto text-xs">
      <h4 className="font-bold">Box Positions:</h4>
      {boxPositions.map((pos, i) => (
        <div key={i}>
          Box {i}: x={pos.x.toFixed(0)}, y={pos.y.toFixed(0)}, w={pos.width.toFixed(0)}, h={pos.height.toFixed(0)}
        </div>
      ))}

      <h4 className="font-bold mt-2">Connections:</h4>
      {connections.map((conn, i) => (
        <div key={i}>
          {conn.from} → {conn.to}
        </div>
      ))}

      <button
        className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
        onClick={() => console.log("Box Positions:", boxPositions, "Connections:", connections)}
      >
        Log to Console
      </button>
    </div>
  );
}
