import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, Col, Row, Spinner } from 'react-bootstrap';
import Table from '../components/Table';
import type { Category, TableColumn } from '../types/types';
import categoriesApi from '../api/categories';
import { CategoryNewRow } from '../components/CategoryRow';

const CategoriesView: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await categoriesApi.getAll();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to fetch categories.');
            console.error('Fetch categories error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleUpdateCategory = async (updatedCategory: Category) => {
        setError(null);
        try {
            await categoriesApi.update(updatedCategory.id, updatedCategory);
            fetchCategories();
        } catch (err) {
            setError('Failed to update category.');
            console.error('Update category error:', err);
        }
    };

    const handleAddCategory = async (newCategoryPartial: Partial<Category>) => {
        setError(null);
        if (!newCategoryPartial.name) {
            setError('Category name cannot be empty.');
            return;
        }
        try {
            const newCategory: Omit<Category, 'id'> = {
                name: newCategoryPartial.name,
                description: newCategoryPartial.description ?? '',
                isExpense: newCategoryPartial.isExpense ?? true,
            };
            await categoriesApi.create(newCategory);
            fetchCategories();
        } catch (err) {
            setError('Failed to add category.');
            console.error('Add category error:', err);
        }
    };

    const handleDeleteCategory = async (categoryId: number) => {
        setError(null);
        try {
            await categoriesApi.delete(categoryId);
            fetchCategories();
        } catch (err) {
            setError('Failed to delete category.');
            console.error('Delete category error:', err);
        }
    };

    const categoryColumns = useMemo<TableColumn<Category>[]>(() => [
        { key: 'name', name: 'Name', type: 'text', editable: true, sortable: true },
        { key: 'description', name: 'Description', type: 'text', editable: true },
    ], []);

    const expenseCategories = useMemo(
        () => categories.filter(cat => cat.isExpense),
        [categories]
    );
    const incomeCategories = useMemo(
        () => categories.filter(cat => !cat.isExpense),
        [categories]
    );

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" /> Loading categories...
            </div>
        );
    }

    return (
        <Row>
            <Col>
                <h2>Expense Categories</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {expenseCategories.length === 0 ? (
                    <Alert variant="info">No expense categories found.</Alert>
                ) : (
                    <Table<Category, 'id'>
                        data={expenseCategories}
                        columns={categoryColumns}
                        idKey="id"
                        onUpdateRow={handleUpdateCategory}
                        onDeleteRow={handleDeleteCategory}
                        onAddRow={handleAddCategory}
                        renderNewRow={onAdd => <CategoryNewRow isExpense onAdd={onAdd} />}
                    />
                )}
            </Col>
            <Col>
                <h2>Income Categories</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {incomeCategories.length === 0 ? (
                    <Alert variant="info">No income categories found.</Alert>
                ) : (
                    <Table<Category, 'id'>
                        data={incomeCategories}
                        columns={categoryColumns}
                        idKey="id"
                        onUpdateRow={handleUpdateCategory}
                        onDeleteRow={handleDeleteCategory}
                        onAddRow={handleAddCategory}
                        renderNewRow={onAdd => <CategoryNewRow onAdd={onAdd} />}
                    />
                )}
            </Col>
        </Row>
    );
};

export default CategoriesView;
