import React from "react";

const CodeViewer = ({ code }) => {
  return (
    <div className="relative mt-4">
      
      {/* Header */}
      <div className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-t-xl flex justify-between">
        <span>Code Preview</span>
        <span className="text-gray-500">Drag to resize ↘</span>
      </div>

      {/* Code Box */}
      <div
        className="bg-[#0d1117] text-gray-300 text-sm p-4 rounded-b-xl 
                   overflow-auto resize both 
                   min-h-[200px] max-h-[600px]
                   border border-gray-700
                   font-mono leading-6"
        style={{ scrollbarWidth: "thin" }}
      >
        <pre className="whitespace-pre-wrap break-words text-left">
          {code || "No code available"}
        </pre>
      </div>

      {/* Thin Scrollbar */}
      <style>
        {`
        div::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background-color: rgba(120, 120, 120, 0.4);
          border-radius: 10px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background-color: rgba(180, 180, 180, 0.6);
        }
        `}
      </style>
    </div>
  );
};

export default CodeViewer;
