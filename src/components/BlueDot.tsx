// crossroads-frontend/src/components/BlueDot.tsx
import React from 'react';

interface BlueDotProps {
  size?: number;
  color?: string;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const BlueDot: React.FC<BlueDotProps> = ({
  size = 16, // Increased default size to accommodate numbers
  color = '#1890ff', // Ant Design primary blue
  textColor = '#ffffff', // White text by default
  className = '',
  style = {},
  children
}) => {
  return (
    <span
      className={`blue-dot ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        color: textColor,
        marginLeft: '6px',
        fontSize: `${Math.max(8, size * 0.6)}px`, // Responsive font size
        lineHeight: 1,
        fontWeight: 'bold',
        verticalAlign: 'middle',
        ...style
      }}
    >
      {children}
    </span>
  );
};

export default BlueDot;