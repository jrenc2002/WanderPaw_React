import React from 'react';

interface DashedCardProps {
  children: React.ReactNode;
  bottomElement?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const DashedCard: React.FC<DashedCardProps> = ({
  children,
  bottomElement,
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
    position: 'relative',
    ...style,
  };

  const dashedBorderStyle: React.CSSProperties = {
    position: 'absolute',
    top: '22px',
    left: '22px',
    right: '22px',
    bottom: '22px',
    borderRadius: '21px',
    border: '2px dashed #D1BA9E',
    pointerEvents: 'none',
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    padding: '22px',
    paddingBottom: bottomElement ? '80px' : '22px', // 为底部元素留出空间
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  };

  return (
    <div className={`dashed-card ${className}`} style={cardStyle}>
      <div className="dashed-border" style={dashedBorderStyle}></div>
      <div className="content" style={contentStyle}>
        {children}
      </div>
      {bottomElement && (
        <div 
          className="bottom-element"
          style={{
            position: 'absolute',
            bottom: '22px',
            left: '22px',
            right: '22px',
            zIndex: 2,
          }}
        >
          {bottomElement}
        </div>
      )}
    </div>
  );
};

export default DashedCard; 