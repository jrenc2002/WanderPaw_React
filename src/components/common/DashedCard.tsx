import React from 'react';

interface DashedCardProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const DashedCard: React.FC<DashedCardProps> = ({
  children,
  width,
  height,
  className = '',
  style = {},
}) => {
  const cardStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: '38px',
    background: '#FDF8F3',
    boxShadow: '0 2px 34.9px 3px rgba(123, 66, 15, 0.11)',
    padding: '22px',
    ...style,
  };

  const dashedBorderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '21px',
    border: '4px dashed #D1BA9E',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div className={`dashed-card ${className}`} style={cardStyle}>
      <div className="dashed-border" style={dashedBorderStyle}>
        {children}
      </div>
    </div>
  );
};

export default DashedCard; 