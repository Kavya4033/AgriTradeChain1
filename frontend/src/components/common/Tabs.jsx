import React from 'react';

const Tabs = ({ items = [], value, onChange, ariaLabel = 'Page sections' }) => {
    return (
        <div className="segmented-tabs" role="tablist" aria-label={ariaLabel}>
            {items.map(item => {
                const isSelected = value === item.id;
                return (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        tabIndex={isSelected ? 0 : -1}
                        className={`segmented-tab${isSelected ? ' active' : ''}`}
                        onClick={() => onChange?.(item.id)}
                    >
                        {item.icon && <span aria-hidden="true">{item.icon}</span>}
                        <span>{item.label}</span>
                        {item.count != null && <span className="segmented-tab-count">{item.count}</span>}
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;