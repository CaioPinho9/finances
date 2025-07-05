import React, { useState, useMemo, type ChangeEvent } from 'react';
import {
    Table as BSTable,
    Form,
    Button,
} from 'react-bootstrap';
import type { TableColumn } from '../types/types';

export type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface TableProps<T extends object, K extends keyof T> {
    data: T[];
    columns: TableColumn<T>[];
    idKey: K;
    onUpdateRow?: (updatedRow: T) => Promise<void> | void;
    onAddRow?: (newRow: Partial<T>) => void;
    onDeleteRow?: (rowId: T[K]) => void;
    renderNewRow?: (onAdd: (newRow: Partial<T>) => void) => React.ReactNode;
}

const Table = <
    T extends object,
    K extends keyof T = keyof T
>({
    data,
    columns,
    idKey,
    onUpdateRow,
    onAddRow,
    onDeleteRow,
    renderNewRow,
}: TableProps<T, K>) => {
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [editingCell, setEditingCell] = useState<{
        rowId: T[K];
        colKey: keyof T;
    } | null>(null);
    const [newValue, setNewValue] = useState<string>('');

    const sortedData = useMemo(() => {
        if (!sortColumn) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return aVal < bVal
                ? sortDirection === 'asc'
                    ? -1
                    : 1
                : aVal > bVal
                    ? sortDirection === 'asc'
                        ? 1
                        : -1
                    : 0;
        });
    }, [data, sortColumn, sortDirection]);

    const handleSort = (columnKey: keyof T, sortable?: boolean) => {
        if (!sortable) return;
        if (sortColumn === columnKey) {
            setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const handleCellClick = (
        rowId: T[keyof T],
        colKey: keyof T,
        currentValue: unknown,
        editable?: boolean
    ) => {
        if (editable && onUpdateRow) {
            setEditingCell({ rowId: rowId as T[K], colKey });
            // always coerce to string for the input
            setNewValue(String(currentValue ?? ''));
        }
    };

    // **Here’s the fixed handler signature:**
    const handleChange = (e: ChangeEvent<FormControlElement>) => {
        setNewValue(e.currentTarget.value);
    };

    const handleBlur = async (row: T) => {
        if (!editingCell) return;
        const { rowId, colKey } = editingCell;
        if (row[idKey] === rowId && String(row[colKey]) !== newValue) {
            const columnDef = columns.find(c => c.key === colKey);
            let parsed: T[keyof T] = (newValue as unknown) as T[keyof T];

            if (columnDef) {
                switch (columnDef.type) {
                    case 'number': {
                        const n = parseFloat(newValue);
                        parsed = (isNaN(n) ? row[colKey] : n) as T[keyof T];
                        break;
                    }
                    case 'date': {
                        parsed = !isNaN(new Date(newValue).getTime())
                            ? (newValue as unknown as T[keyof T])
                            : row[colKey];
                        break;
                    }
                    default:
                        // text & select are fine as strings
                        parsed = (newValue as unknown) as T[keyof T];
                }
            }

            if (onUpdateRow) {
                await onUpdateRow({ ...row, [colKey]: parsed });
            }
        }

        setEditingCell(null);
        setNewValue('');
    };

    const renderCellContent = (row: T, column: TableColumn<T>) => {
        const isEditing =
            editingCell?.rowId === row[idKey] &&
            editingCell?.colKey === column.key;
        const raw = row[column.key];

        if (isEditing) {
            const commonProps = {
                value: newValue,
                onChange: handleChange,
                onBlur: () => handleBlur(row),
                onKeyDown: (e: React.KeyboardEvent) =>
                    e.key === 'Enter' && (e.currentTarget as HTMLElement).blur(),
                autoFocus: true,
            };

            switch (column.type) {
                case 'text':
                case 'number':
                case 'date':
                    return <Form.Control type={column.type} {...commonProps} />;
                case 'select':
                    return (
                        <Form.Select
                            aria-label={column.name}
                            title={column.name}
                            {...commonProps}
                            onClick={e => e.stopPropagation()}
                        >
                            {column.options?.map(o => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </Form.Select>
                    );
                default:
                    return String(raw);
            }
        }

        if (column.render) {
            return column.render(raw, row);
        }

        return String(raw);
    };

    return (
        <BSTable striped bordered hover responsive>
            <thead>
                <tr>
                    {columns.map(col => (
                        <th
                            key={String(col.key)}
                            onClick={() => handleSort(col.key, col.sortable)}
                            style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                        >
                            {col.name}
                            {sortColumn === col.key && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                    ))}
                    {(onUpdateRow || onDeleteRow) && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {sortedData.map(row => (
                    <tr key={String(row[idKey])}>
                        {columns.map(col => (
                            <td
                                key={String(col.key)}
                                onClick={() =>
                                    handleCellClick(
                                        row[idKey] as T[keyof T],
                                        col.key,
                                        row[col.key],
                                        col.editable
                                    )
                                }
                                style={{
                                    cursor: col.editable && onUpdateRow ? 'pointer' : 'default',
                                }}
                            >
                                {renderCellContent(row, col)}
                            </td>
                        ))}
                        {(onUpdateRow || onDeleteRow) && (
                            <td>
                                {onDeleteRow && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onDeleteRow(row[idKey] as T[K])}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
                {renderNewRow && (
                    <tr>
                        <td colSpan={columns.length + (onUpdateRow || onDeleteRow ? 1 : 0)}>
                            {renderNewRow(onAddRow!)}
                        </td>
                    </tr>
                )}
            </tbody>
        </BSTable>
    );
};

export default Table;
