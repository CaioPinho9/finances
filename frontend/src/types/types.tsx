export interface Category {
    id: number;
    name: string;
    description?: string;
    isExpense: boolean;
}

export interface Transaction {
    id: string; // Assuming UUID from backend
    amount: number;
    date: string; // ISO Date string (YYYY-MM-DD)
    title: string;
    parcelaAtual?: number;
    parcelaTotal?: number;
    description?: string;
    category?: Category; // Assuming category can be null or a Category object
    userId: number;
}

export interface TransactionTemplate {
    // Assuming a TransactionTemplate has a 'title' as its identifier
    title: string;
    amount: number;
    description?: string;
    categoryId?: number; // Assuming a link to Category by ID
    userId: number;
    // Add other fields as needed
}

export type ColumnType = 'text' | 'number' | 'date' | 'select'; // Extend as needed

export interface TableColumn<T> {
    key: keyof T;
    name: string;
    type: ColumnType;
    sortable?: boolean;
    editable?: boolean;
    options?: { value: string | number; label: string }[]; // For 'select' type
    render?: (value: unknown, row: T) => React.ReactNode; // Custom render function
}

// CsvType is now a union type
export enum CsvType {
    NUBANK_EXTRACT = 'NUBANK_EXTRACT',
    NUBANK_CREDIT_EXTRACT = 'NUBANK_CREDIT_EXTRACT',
}
