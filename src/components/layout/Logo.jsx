import React from 'react';

const Logo = ({ className = "h-12" }) => {
  return (
    <img 
      src="/logo.svg" 
      alt="Batela Connect"
      className={className}
      style={{
        maxWidth: '200px',
        height: 'auto'
      }}
    />
  );
};

export default Logo;