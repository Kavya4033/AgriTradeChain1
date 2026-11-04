import React from 'react';

const DataTable = ({
    columns = [],
    rows = [],
    rowKey = '_id',
    minWidth = '52rem',
    caption,
    emptyState = 'No records to display.'
}) => {
    return (
        <div className="data-table-scroll">
            <table className="data-table" style={{ minWidth }}>
                {caption && <caption>{caption}</caption>}
                <thead>
                    <tr>
                        {columns.map(column => (
                            <th key={column.key} scope="col" style={{ textAlign: column.align || 'left' }}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? rows.map((row, rowIndex) => {
                        const key = typeof rowKey === 'function' ? rowKey(row, rowIndex) : row?.[rowKey];
                        return (
                            <tr key={key ?? rowIndex}>
                                {columns.map(column => (
                                    <td key={column.key} style={{ textAlign: column.align || 'left' }}>
                                        {column.render ? column.render(row?.[column.key], row) : row?.[column.key]}
                                    </td>
                                ))}
                            </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan={Math.max(columns.length, 1)}>{emptyState}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;