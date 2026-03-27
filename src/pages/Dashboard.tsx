import React, { useState } from 'react';
import axios from 'axios'; // Make sure to npm install axios
import '../assets/styles/Dashboard.css'; // Create this CSS file for styling

type FieldType = 'text' | 'number' | 'email' | 'boolean' | 'array';

interface SchemaField {
  name: string;
  label: string;
  type: FieldType;
}

const API_BASE = (import.meta.env.VITE_PRODUCTION=="true")? import.meta.env.VITE_PROD_BACKEND_URL: import.meta.env.VITE_DEV_BACKEND_URL;
// const API_BASE = import.meta.env.VITE_DEV_BACKEND_URL;
console.log("In Dashboard - API BASE URL:", API_BASE, "PROD: ", import.meta.env.VITE_PRODUCTION);


const dbSchemas: Record<string, SchemaField[]> = {
  // 'e21-students': [
  //   { name: 'name', label: 'Name', type: 'text' },
  //   { name: 'class', label: 'Class', type: 'number' },
  //   { name: 'phone', label: 'Phone', type: 'number' },
  //   { name: 'formattedID', label: 'Formatted ID', type: 'text' },
  //   { name: 'school', label: 'School', type: 'text' },
  //   { name: 'email', label: 'Email', type: 'email' },
  // ],
  'e21-teams': [
    { name: 'teamName', label: 'Team Name', type: 'text' },
    { name: 'email', label: 'Team Email', type: 'email' },
    { name: 'leaderID', label: 'Leader ID', type: 'text' },
  ],
  'if_students': [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'roll', label: 'Roll Number', type: 'text' },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'cgpa', label: 'CGPA', type: 'number' },
  ],
  'meetupusers': [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'startupName', label: 'Startup Name', type: 'text' },
    { name: 'definesYouBest', label: 'Role/Defines you best', type: 'text' },
  ],
  'teamupparticipants': [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'roll', label: 'Roll Number', type: 'text' },
    { name: 'branch', label: 'Branch', type: 'text' },
    { name: 'isCoFounderMatchingRegistered', label: 'Co-Founder Matching?', type: 'boolean' },
  ],
};

export default function Dashboard() {
  const [selectedDB, setSelectedDB] = useState<string>('e21-students');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentFields = dbSchemas[selectedDB] || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]); // Clear previous results

    const cleanedFilters = Object.keys(formData).reduce((acc, key) => {
    let value = formData[key];
    // If it's a string, trim it. Otherwise, keep it as is (for booleans/numbers)
    
    if(typeof value === 'string'){
      value = value.trim();
    }
    acc[key] = typeof value === 'string' ? value.trim() : value;
    return acc;
  }, {} as Record<string, any>);

    try {
      // Replace with your actual EC2 backend IP and Port
      const response = await axios.post(`${API_BASE}/api/records/search`, {
        "dbName": selectedDB,
        "filters": formData
      });
      
      setResults(response.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch records. Check network.");
    } finally {
      setLoading(false);
    }
  };

  const handleDBChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDB(e.target.value);
    setFormData({});
    setResults([]); 
    setError('');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card mb-8">
        <h1 className="dashboard-title">Search E-Cell Records</h1>
        <p className="text-muted mb-6">Leave fields blank to view all records in the collection.</p>

        {/* Database Selector */}
        <div className="form-group">
          <label>Select Database Context</label>
          <select value={selectedDB} onChange={handleDBChange}>
            {Object.keys(dbSchemas).map((db) => (
              <option key={db} value={db}>
                {db}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Search Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {currentFields.map((field) => (
              <div key={field.name} className="form-group">
                {field.type === 'boolean' ? (
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      checked={formData[field.name] || false}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={field.name} style={{ margin: 0 }}>
                      {field.label}
                    </label>
                  </div>
                ) : (
                  <>
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                      id={field.name}
                      type={field.type === 'number' ? 'number' : 'text'}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      placeholder={`Search by ${field.label.toLowerCase()}`}
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Searching...' : `Search ${selectedDB}`}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {error && <div className="error-message">{error}</div>}
      
      {results.length > 0 && (
        <div className="dashboard-card">
          <h2 className="dashboard-title">Results ({results.length})</h2>
          <div className="results-container">
            {results.map((record, index) => (
              <div key={index} className="result-card">
                {/* Dynamically render all keys in the returned record */}
                {Object.entries(record).map(([key, val]) => {
                  if (key === '__v' || key === 'password') return null; // Hide internal/secret fields
                  return (
                    <div key={key} className="result-row">
                      <span className="result-key">{key}:</span>
                      <span className="result-value">
                         {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}