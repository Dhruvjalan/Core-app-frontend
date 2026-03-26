// components/GDrive/GDriveFileList.tsx
import React from 'react';
import '../../assets/styles/GDive/GDriveFileList.css';

interface GFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  parents?: string[];
}

interface GDriveFileListProps {
  files: GFile[];
  onFolderClick: (folderId: string, folderName: string) => void;
  currentFolder: string;
}

const GDriveFileList: React.FC<GDriveFileListProps> = ({
  files,
  onFolderClick,
  currentFolder,
}) => {
  const formatDate = (dateString: string) => {
    if(1 || currentFolder)
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (isNaN(size)) return '-';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }

    return `${formattedSize.toFixed(1)} ${units[unitIndex]}`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return '📁';
    }
    
    const iconMap: { [key: string]: string } = {
      'application/pdf': '📄',
      'image/': '🖼️',
      'video/': '🎬',
      'audio/': '🎵',
      'text/': '📝',
      'application/vnd.google-apps.document': '📘',
      'application/vnd.google-apps.spreadsheet': '📊',
      'application/vnd.google-apps.presentation': '📽️',
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (mimeType.startsWith(key)) {
        return icon;
      }
    }

    return '📄';
  };

  const handleFileClick = (file: GFile) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      onFolderClick(file.id, file.name);
    } else if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };

  if (files.length === 0) {
    return (
      <div className="empty-folder">
        <p>This folder is empty</p>
      </div>
    );
  }

  return (
    <div className="gdrive-file-list">
      <div className="file-list-header">
        <div className="header-name">Name</div>
        <div className="header-modified">Modified</div>
        <div className="header-size">Size</div>
      </div>
      
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className="file-item"
            onClick={() => handleFileClick(file)}
          >
            <div className="file-icon-name">
              <span className="file-icon">{getFileIcon(file.mimeType)}</span>
              <span className="file-name">{file.name}</span>
            </div>
            <div className="file-modified">
              {formatDate(file.modifiedTime)}
            </div>
            <div className="file-size">
              {file.mimeType === 'application/vnd.google-apps.folder' 
                ? '-' 
                : formatFileSize(file.size || '0')
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GDriveFileList;