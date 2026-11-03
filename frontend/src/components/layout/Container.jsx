import React from 'react';

const Container = ({ children, style = {}, className = '', as: Component = 'div', ...props }) => {
    return (
        <Component
            className={`app-container ${className}`}
            style={{
                width: '100%',
                maxWidth: '1440px',
                marginInline: 'auto',
                paddingInline: 'clamp(16px, 3vw, 40px)',
                boxSizing: 'border-box',
                ...style
            }}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Container;
