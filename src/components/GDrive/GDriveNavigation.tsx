// components/GDrive/GDriveNavigation.tsx
import React from 'react';
import '../../assets/styles/GDive/GDriveNavigation.css';

interface Breadcrumb {
  id: string;
  name: string;
}

interface GDriveNavigationProps {
  breadcrumbs: Breadcrumb[];
  onBreadcrumbClick: (folderId: string) => void;
}

const GDriveNavigation: React.FC<GDriveNavigationProps> = ({
  breadcrumbs,
  onBreadcrumbClick,
}) => {
  return (
    <div className="gdrive-navigation">
      <nav className="breadcrumbs">
        {breadcrumbs.map((breadcrumb, index) => (
          <span key={breadcrumb.id} className="breadcrumb-item">
            {index > 0 && <span className="separator">/</span>}
            <button
              onClick={() => onBreadcrumbClick(breadcrumb.id)}
              className={`breadcrumb-link ${index === breadcrumbs.length - 1 ? 'current' : ''}`}
            >
              {breadcrumb.name}
            </button>
          </span>
        ))}
      </nav>
    </div>
  );
};

export default GDriveNavigation;