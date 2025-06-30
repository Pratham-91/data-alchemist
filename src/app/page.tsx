"use client";

import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-12">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 text-sm font-medium">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          AI-Powered Data Management
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 leading-tight">
          Transform Your
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Data</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Upload messy spreadsheets and watch as our AI transforms them into clean, validated datasets. 
          From data ingestion to export, we handle everything with intelligent automation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/upload"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link 
            href="/validate"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
            <span className="text-white text-2xl">📤</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Upload</h3>
          <p className="text-gray-600 mb-6">
            Drag and drop your CSV or Excel files. Our AI automatically detects formats and begins processing immediately.
          </p>
          <Link href="/upload" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Start Uploading →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <span className="text-white text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Validation</h3>
          <p className="text-gray-600 mb-6">
            Intelligent validation rules check your data for errors, duplicates, and inconsistencies with real-time feedback.
          </p>
          <Link href="/validate" className="text-green-600 font-medium hover:text-green-700 transition-colors">
            Validate Data →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
            <span className="text-white text-2xl">📥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Export Ready</h3>
          <p className="text-gray-600 mb-6">
            Export your cleaned data in multiple formats with custom options and business rules included.
          </p>
          <Link href="/export" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
            Export Data →
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Trusted by Data Teams</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Files Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Processing</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload</h3>
              <p className="text-gray-600 text-sm">Drag & drop your files or browse to select</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Process</h3>
              <p className="text-gray-600 text-sm">AI analyzes and cleans your data automatically</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Validate</h3>
              <p className="text-gray-600 text-sm">Run validation rules and fix any issues</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Export</h3>
              <p className="text-gray-600 text-sm">Download your clean, validated data</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 py-12">
        <h2 className="text-4xl font-bold text-gray-900">Ready to Transform Your Data?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands of data professionals who trust Data Alchemist for their data management needs.
        </p>
        <Link 
          href="/upload"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span>🚀</span>
          <span className="ml-2">Start Your Free Trial</span>
        </Link>
      </div>
    </div>
  );
} 