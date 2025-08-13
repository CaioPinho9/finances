import React, { useState } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import type { Category } from '../types/types';

interface CategoryNewRowProps {
    onAdd: (newRow: Partial<Category>) => void;
    isExpense?: boolean; 
}

export function CategoryNewRow(props: Readonly<CategoryNewRowProps>) {
    const { onAdd, isExpense } = props;

    const [newCategory, setNewCategory] = useState<Partial<Category>>({
        name: '',
        description: '',
        isExpense: isExpense ?? false,
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(prev => ({
            ...prev,
            name: e.target.value,
        }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(prev => ({
            ...prev,
            description: e.target.value,
        }));
    };

    const handleAdd = () => {
        onAdd(newCategory);
        setNewCategory({
            name: '',
            description: '',
            isExpense: isExpense,
        })
    };

    return (
        <InputGroup className="my-2">
            <Form.Control
                type="text"
                placeholder="Category Name"
                value={newCategory.name || ''}
                onChange={handleNameChange}
            />
            <Form.Control
                type="text"
                placeholder="Optional Description"
                value={newCategory.description || ''}
                onChange={handleDescriptionChange}
            />
            <Button variant="success" onClick={handleAdd}>
                Add Category
            </Button>
        </InputGroup>
    );
}