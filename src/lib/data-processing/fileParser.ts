import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedData {
  data: Record<string, unknown>[];
  headers: string[];
  fileName: string;
  fileType: 'csv' | 'xlsx';
}

export async function parseFile(file: File): Promise<ParsedData> {
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  if (fileExtension === 'csv') {
    return parseCSV(file);
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    return parseXLSX(file);
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or XLSX file.');
  }
}

function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          return;
        }
        
        const data = results.data as Record<string, unknown>[];
        const headers = results.meta.fields || [];
        
        resolve({
          data,
          headers,
          fileName: file.name,
          fileType: 'csv'
        });
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      }
    });
  });
}

async function parseXLSX(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty'));
          return;
        }
        
        // First row contains headers
        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1) as unknown[][];
        
        // Convert to array of objects
        const parsedData = dataRows.map(row => {
          const obj: Record<string, unknown> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        
        resolve({
          data: parsedData,
          headers,
          fileName: file.name,
          fileType: 'xlsx'
        });
      } catch (error) {
        reject(new Error(`XLSX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
} 