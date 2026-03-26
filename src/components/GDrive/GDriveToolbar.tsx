// components/GDrive/GDriveToolbar.tsx
import React from 'react';
import '../../assets/styles/GDive/GDriveToolbar.css';

interface GDriveToolbarProps {
  onRefresh: () => void;
  currentFolder: string;
}

const GDriveToolbar: React.FC<GDriveToolbarProps> = ({
  onRefresh,
  currentFolder,
}) => {
  return (
    <div className="gdrive-toolbar">
      <div className="toolbar-left">
        <button onClick={onRefresh} className="toolbar-btn refresh-btn">
          Refresh
        </button>
      </div>
      <div className="toolbar-right">
        <span className="folder-info">
          Current Folder: {currentFolder === 'root' ? 'My Drive' : currentFolder}
        </span>
      </div>
    </div>
  );
};

export default GDriveToolbar;