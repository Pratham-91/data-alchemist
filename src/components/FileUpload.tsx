"use client";

import React, { useRef, useState } from "react";
import { parseFile, ParsedData } from "@/lib/data-processing/fileParser";

const ACCEPTED_TYPES = [
  ".csv",
  ".xlsx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

interface FileUploadProps {
  onFileParsed?: (parsedData: ParsedData) => void;
}

export default function FileUpload({ onFileParsed }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setLoading(true);
    
    try {
      const parsedData = await parseFile(selectedFile);
      onFileParsed?.(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      handleFile(f);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      handleFile(f);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-300 ${
          dragActive 
            ? "border-blue-500 bg-blue-50/50 scale-105" 
            : "border-gray-300 bg-gray-50/30 hover:border-gray-400 hover:bg-gray-50/50"
        } ${file && !loading && !error ? "border-green-300 bg-green-50/30" : ""}`}
        onDragOver={e => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: "pointer" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={handleChange}
        />
        
        {/* Upload Icon */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
          dragActive ? "bg-blue-100 scale-110" : "bg-gray-100"
        }`}>
          <span className="text-4xl">📄</span>
        </div>
        
        {/* Upload Text */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {dragActive ? "Drop your file here" : "Upload your data file"}
        </h3>
        <p className="text-gray-600 text-center mb-4">
          Drag and drop your CSV or XLSX file here, or click to browse
        </p>
        
        {/* File Types */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            CSV
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Excel
          </span>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="mt-6 text-blue-600">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Processing your file...</span>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600">
              <span className="text-lg">❌</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}
        
        {/* Success State */}
        {file && !loading && !error && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">✓</span>
                </div>
                <div>
                  <div className="font-semibold text-green-800">{file.name}</div>
                  <div className="text-sm text-green-600">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <div className="text-green-600">
                <span className="text-sm font-medium">Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 