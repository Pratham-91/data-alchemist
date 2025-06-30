"use client";

import React, { useState } from "react";
import FileUpload from "../../components/FileUpload";
import DataGrid from "../../components/data-grid/DataGrid";
import { ParsedData } from "../../lib/data-processing/fileParser";

export default function UploadPage() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const handleFileParsed = (data: ParsedData) => {
    setParsedData(data);
  };

  const handleDataChange = (newData: Record<string, unknown>[]) => {
    if (parsedData) {
      setParsedData({ ...parsedData, data: newData });
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Data Ingestion
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Transform Your Data
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload CSV or XLSX files and watch as our AI-powered system transforms your messy data into organized, validated datasets.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Your Files</h2>
            <p className="text-gray-600">Support for Clients, Workers, and Tasks data</p>
          </div>
          
          <FileUpload onFileParsed={handleFileParsed} />
        </div>
      </div>
      
      {/* Data Display Section */}
      {parsedData && (
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Parsed Data</h2>
                <p className="text-gray-600 mt-1">
                  {parsedData.fileName} • {parsedData.data.length} rows • {parsedData.headers.length} columns
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Successfully Parsed</span>
              </div>
            </div>
            
            <DataGrid data={parsedData.data} onDataChange={handleDataChange} />
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Parsing</h3>
          <p className="text-gray-600 text-sm">Automatically detects and parses CSV and Excel files with intelligent column mapping.</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">✏️</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Inline Editing</h3>
          <p className="text-gray-600 text-sm">Edit data directly in the grid with real-time validation and error checking.</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Advanced Search</h3>
          <p className="text-gray-600 text-sm">Search, sort, and filter your data with powerful grid controls and pagination.</p>
        </div>
      </div>
    </div>
  );
} 