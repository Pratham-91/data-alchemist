"use client";

import React, { useState } from "react";

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  extension: string;
}

interface ExportOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    { id: '1', name: 'Include Headers', description: 'Add column headers to the exported file', enabled: true },
    { id: '2', name: 'Include Validation Results', description: 'Export validation status for each record', enabled: false },
    { id: '3', name: 'Include Metadata', description: 'Add file metadata and export timestamp', enabled: true },
    { id: '4', name: 'Compress File', description: 'Create a compressed archive for large datasets', enabled: false },
  ]);

  const exportFormats: ExportFormat[] = [
    {
      id: 'csv',
      name: 'CSV',
      description: 'Comma-separated values format',
      icon: '📄',
      extension: '.csv'
    },
    {
      id: 'xlsx',
      name: 'Excel',
      description: 'Microsoft Excel format',
      icon: '📊',
      extension: '.xlsx'
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'JavaScript Object Notation',
      icon: '🔧',
      extension: '.json'
    },
    {
      id: 'xml',
      name: 'XML',
      description: 'Extensible Markup Language',
      icon: '📋',
      extension: '.xml'
    }
  ];

  const handleOptionToggle = (optionId: string) => {
    setExportOptions(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, enabled: !option.enabled }
          : option
      )
    );
  };

  const handleExport = () => {
    // Simulate export process
    console.log('Exporting with format:', selectedFormat);
    console.log('Options:', exportOptions);
    
    // In a real app, this would trigger the actual export
    alert(`Export started! Format: ${selectedFormat.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
          Data Export
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Export Your Data
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose your preferred format and options to export your cleaned and validated data.
        </p>
      </div>

      {/* Export Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">File Size</p>
              <p className="text-2xl font-bold text-gray-900">2.4 MB</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">💾</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-2xl font-bold text-gray-900">2 min ago</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">🕒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Format Selection */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Export Format</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportFormats.map((format) => (
              <div
                key={format.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedFormat === format.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedFormat(format.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{format.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{format.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{format.description}</p>
                  <span className="text-xs text-gray-500">{format.extension}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Export Options</h2>
          <div className="space-y-4">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={option.enabled}
                    onChange={() => handleOptionToggle(option.id)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Preview */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Export Preview</h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">data_export{exportFormats.find(f => f.id === selectedFormat)?.extension}</h3>
                <p className="text-sm text-gray-600">Estimated size: 2.4 MB</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Format</p>
                <p className="font-medium text-gray-900">{exportFormats.find(f => f.id === selectedFormat)?.name}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>1,247 records will be exported</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>All validation checks passed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Metadata and timestamps included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Action */}
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg flex items-center space-x-2"
        >
          <span>📥</span>
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
} 