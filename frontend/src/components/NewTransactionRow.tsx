// src/components/NewTransactionRow.tsx
import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import type { Category, Transaction } from '../types/types';

type ChangeEvent =
  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

interface Props {
  onAdd: (newRow: Partial<Transaction>) => void;
  categories: Category[];
}

const NewTransactionRow: React.FC<Props> = ({ onAdd, categories }) => {
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    date: moment().format('YYYY-MM-DD'),
    title: '',
    amount: 0,
    description: '',
    parcelaAtual: undefined,
    parcelaTotal: undefined,
    category: undefined,
  });

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setNewTx(prev => {
      if (name === 'amount') {
        return { ...prev, amount: parseFloat(value) || 0 };
      }
      if (name === 'category') {
        const cat = categories.find(c => c.id === +value);
        return { ...prev, category: cat };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleAdd = () => {
    onAdd(newTx);
    setNewTx({
      date: moment().format('DD/MM/YYYY'),
      title: '',
      amount: 0,
      description: '',
      parcelaAtual: undefined,
      parcelaTotal: undefined,
      category: undefined,
    });
  };

  return (
    <InputGroup className="my-2">
      <Form.Control
        type="date"
        name="date"
        value={newTx.date}
        onChange={handleChange}
      />
      <Form.Control
        type="text"
        name="title"
        placeholder="Title"
        value={newTx.title}
        onChange={handleChange}
      />
      <Form.Control
        type="number"
        name="amount"
        placeholder="Amount"
        value={newTx.amount}
        onChange={handleChange}
      />
      <Form.Label htmlFor="category-select" visuallyHidden>
        Category
      </Form.Label>
      <Form.Select
        id="category-select"
        name="category"
        aria-label="Category"
        value={newTx.category?.id ?? ''}
        onChange={handleChange}
      >
        <option value="">Select category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Form.Select>
      <Form.Control
        type="number"
        name="parcelaAtual"
        placeholder="Parcel #"
        value={newTx.parcelaAtual ?? ''}
        onChange={handleChange}
      />
      <Form.Control
        type="number"
        name="parcelaTotal"
        placeholder="Total parcels"
        value={newTx.parcelaTotal ?? ''}
        onChange={handleChange}
      />
      <Form.Control
        as="text"
        name="description"
        placeholder="Description"
        value={newTx.description ?? ''}
        onChange={handleChange}
      />
      <Button variant="success" onClick={handleAdd}>
        Adicionar
      </Button>
    </InputGroup>
  );
};

export default NewTransactionRow;
