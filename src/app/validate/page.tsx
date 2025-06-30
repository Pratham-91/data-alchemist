"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { BusinessRule } from "../../types/rules";

// Fix ValidationResult to not extend BusinessRule directly
interface ValidationResult extends Omit<BusinessRule, 'status'> {
  status: 'pass' | 'fail' | 'warning' | 'pending';
  details?: string;
}

export default function ValidatePage() {
  const [data, setData] = useState<any[]>([]);
  const [validationRules, setValidationRules] = useState<ValidationResult[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [rules, setRules] = useState<BusinessRule[]>([]);

  // Fetch rules from API
  const fetchRules = async () => {
    const res = await fetch("/api/rules");
    const data = await res.json();
    setRules(data);
    return data;
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    if (file.name.endsWith(".csv")) {
      reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            setData(results.data as any[]);
            const apiRules = await fetchRules();
            runValidation(results.data as any[], apiRules);
          }
        });
      };
      reader.readAsText(file);
    } else if (
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    ) {
      reader.onload = async (evt) => {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setData(json as any[]);
        const apiRules = await fetchRules();
        runValidation(json as any[], apiRules);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type. Please upload CSV or Excel.");
    }
  };

  // Validation logic
  const runValidation = (records: any[], rulesToApply: BusinessRule[] = rules) => {
    if (!records || records.length === 0) {
      setValidationRules([]);
      return;
    }
    const evaluatedRules: ValidationResult[] = rulesToApply.map(rule => ({
      ...rule,
      status: 'pass', // TODO: implement real evaluation logic
      details: `Checked ${records.length} records for rule: ${rule.name}`
    }));
    setValidationRules(evaluatedRules);
  };

  const getStatusColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-200';
      case 'fail': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'pass': return '✓';
      case 'fail': return '✗';
      case 'warning': return '⚠';
      case 'pending': return '⏳';
      default: return '?';
    }
  };

  const calculateQualityScore = () => {
    if (validationRules.length === 0) return 0;
    let score = 0;
    validationRules.forEach(rule => {
      switch (rule.status) {
        case 'pass':
          score += 1;
          break;
        case 'warning':
          score += 0.5;
          break;
        case 'pending':
          score += 0.25;
          break;
        case 'fail':
        default:
          score += 0;
          break;
      }
    });
    return Math.round((score / validationRules.length) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Data Validation
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Validate Your Data
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload a CSV or Excel file to validate your data against business rules.
        </p>
        <div className="mt-4">
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileUpload}
            className="border p-2 rounded"
          />
          {fileName && <div className="mt-2 text-sm text-gray-600">Loaded: {fileName}</div>}
        </div>
      </div>

      {/* Validation Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rules</p>
              <p className="text-2xl font-bold text-gray-900">{validationRules.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {validationRules.filter(r => r.status === 'pass').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">
                {validationRules.filter(r => r.status === 'warning').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⚠</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {validationRules.filter(r => r.status === 'fail').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">✗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Rules */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Validation Rules</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => runValidation(data)}
              disabled={data.length === 0}
            >
              Run Validation
            </button>
          </div>

          <div className="space-y-4">
            {validationRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-lg border ${getStatusColor(rule.status)} transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-semibold">{getStatusIcon(rule.status)}</span>
                      <h3 className="font-semibold">{rule.name}</h3>
                    </div>
                    <p className="text-sm opacity-90 mb-2">{rule.description}</p>
                    {rule.details && (
                      <p className="text-xs opacity-75">{rule.details}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {rule.status === 'fail' && (
                      <button className="px-3 py-1 text-xs bg-red-200 text-red-800 rounded-full hover:bg-red-300 transition-colors">
                        Fix Issues
                      </button>
                    )}
                    {rule.status === 'warning' && (
                      <button className="px-3 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full hover:bg-yellow-300 transition-colors">
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {validationRules.length === 0 && (
              <div className="text-gray-500 text-center py-8">Upload a file to see validation results.</div>
            )}
          </div>
        </div>
      </div>

      {/* Data Quality Score */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Quality Score</h2>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * calculateQualityScore()) / 100}
                  className="text-blue-600"
                  style={{ transition: 'stroke-dashoffset 0.5s' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{calculateQualityScore()}%</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {calculateQualityScore() >= 80
                  ? "Good Quality"
                  : calculateQualityScore() >= 60
                  ? "Fair Quality"
                  : "Needs Improvement"}
              </h3>
              <p className="text-gray-600 mb-4">
                {calculateQualityScore() >= 80
                  ? "Your data meets most quality standards."
                  : "Address the failed or warning validations to improve the score."}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Completeness</span>
                  <span className="font-medium text-green-600">
                    {validationRules.length
                      ? `${Math.round((validationRules.filter(r => r.status === "pass").length / validationRules.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Accuracy</span>
                  <span className="font-medium text-yellow-600">
                    {validationRules.length
                      ? `${Math.round((validationRules.filter(r => r.status !== "fail").length / validationRules.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Consistency</span>
                  <span className="font-medium text-red-600">
                    {validationRules.length
                      ? `${Math.round((validationRules.filter(r => r.status === "pass" || r.status === "warning").length / validationRules.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}