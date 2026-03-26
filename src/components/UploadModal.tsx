// crossroads-frontend/src/components/UploadModal.tsx
import React, { useState } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, content?: string) => void; // Updated to accept content
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileContent, setFileContent] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileContent(''); // Reset content when new file is selected
      
      // Read .txt files immediately
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        readTextFile(file);
      }
    }
  };

  const readTextFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      //console.log(('File content:', content);
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setFileContent('Error reading file content');
    };
    
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      await onUpload(selectedFile, fileContent); // Pass content to parent
      onClose();
      setSelectedFile(null);
      setFileContent('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <h2 className="modal-title">Upload Document</h2>
        
        <div className="file-upload-placeholder" onClick={() => document.getElementById('file-input')?.click()}>
          {selectedFile ? (
            <div>
              <p style={{color:'black'}}><strong style={{color:'black'}}>Selected:</strong> {selectedFile.name}</p>
              <p style={{color:'black'}}><strong style={{color:'black'}}>Type:</strong> {selectedFile.type || 'Unknown'}</p>
              <p style={{color:'black'}}><strong style={{color:'black'}}>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <p style={{color:'black'}}>Click to select a file or drag and drop</p>
          )}
          <input
            id="file-input"
            type="file"
            accept=".doc,.docx,.pdf,.txt,.md"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Display file content for text files */}
        {fileContent && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            backgroundColor: '#f9f9f9',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'black' }}>File Content Preview:</h4>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              wordWrap: 'break-word',
              margin: 0,
              fontSize: '12px',
              lineHeight: '1.4',
              color:'black',
            }}>
              {fileContent}
            </pre>
          </div>
        )}

        {selectedFile && !fileContent && (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) && (
          <p style={{ fontSize: '12px', color: '#666', marginTop: '0.5rem' }}>
            Reading file content...
          </p>
        )}

        <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={onClose}
            className="modal-close-button"
            style={{ backgroundColor: '#6c757d' }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="modal-close-button"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;