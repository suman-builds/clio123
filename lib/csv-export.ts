/**
 * Utility functions for CSV export
 */

/**
 * Convert an array of objects to CSV format
 * @param data Array of objects to convert
 * @param headers Optional custom headers (if not provided, will use object keys)
 * @returns CSV string
 */
export function objectsToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  let csv = csvHeaders.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = csvHeaders.map(header => {
      // Get the value (using header as key)
      const value = header.includes('.') 
        ? getNestedValue(item, header) 
        : item[header];
      
      // Format the value for CSV
      return formatCSVValue(value);
    });
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

/**
 * Get a nested value from an object using dot notation
 * @param obj The object to extract from
 * @param path The path in dot notation (e.g., "user.address.city")
 * @returns The value at the specified path
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj);
}

/**
 * Format a value for CSV inclusion
 * @param value Any value to format
 * @returns Formatted string safe for CSV
 */
function formatCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Handle dates
  if (value instanceof Date) {
    return `"${value.toISOString()}"`;
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return `"${value.join('; ')}"`;
  }
  
  // Handle objects
  if (typeof value === 'object') {
    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
  }
  
  // Handle strings (escape quotes and wrap in quotes if contains comma)
  if (typeof value === 'string') {
    const escaped = value.replace(/"/g, '""');
    return escaped.includes(',') || escaped.includes('\n') || escaped.includes('"') 
      ? `"${escaped}"` 
      : escaped;
  }
  
  // Return as is for numbers, booleans, etc.
  return String(value);
}

/**
 * Download CSV data as a file
 * @param csvData CSV string data
 * @param filename Filename to save as
 */
export function downloadCSV(csvData: string, filename: string): void {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV and trigger download
 * @param data Array of objects to export
 * @param filename Filename to save as
 * @param headers Optional custom headers
 */
export function exportToCSV(data: any[], filename: string, headers?: string[]): void {
  const csvData = objectsToCSV(data, headers);
  downloadCSV(csvData, filename);
}