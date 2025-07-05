import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Form, Alert, Spinner, Button } from "react-bootstrap";
import moment from "moment";
import Table, { type FormControlElement } from "../components/Table";
import UploadCsv from "../components/UploadCsv";
import NewTransactionRow from "../components/NewTransactionRow";
import categoriesApi from "../api/categories";
import type { Category, TableColumn, Transaction } from "../types/types";
import transactionsApi from "../api/transaction";
import transactionTemplatesApi from "../api/transactionTemplate";

const TransactionsView: React.FC = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<Transaction[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const userId = 1;

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionsApi.getByMonth(currentYear, currentMonth);
      const data = response.data;
      const sortedByDate = data.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setExpenses(sortedByDate.filter((t) => t.amount < 0));
      setIncome(sortedByDate.filter((t) => t.amount >= 0));
    } catch {
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch {
      setError("Failed to fetch categories.");
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  const handleDateChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    if (name === "year") setCurrentYear(+value);
    if (name === "month") setCurrentMonth(+value);
  };

  const handleUpdateTransaction = async (tx: Transaction) => {
    setError(null);
    try {
      await transactionsApi.update(tx.id, tx);
      fetchTransactions();
    } catch {
      setError("Failed to update transaction.");
    }
  };

  const handleAddTransaction = async (newTx: Partial<Transaction>) => {
    setError(null);
    try {
      const payload: Omit<Transaction, "id"> = {
        date: newTx.date || moment().format("YYYY-MM-DD"),
        amount: newTx.amount ?? 0,
        title: newTx.title || "New Transaction",
        description: newTx.description,
        parcelaAtual: newTx.parcelaAtual,
        parcelaTotal: newTx.parcelaTotal,
        category: newTx.category,
        userId,
      };
      await transactionsApi.create(payload);
      fetchTransactions();
    } catch {
      setError("Failed to add transaction.");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setError(null);
    try {
      await transactionsApi.delete(id);
      fetchTransactions();
    } catch {
      setError("Failed to delete transaction.");
    }
  };

  const expenseCategoryOptions = useMemo(
    () =>
      categories
        .filter((c) => c.isExpense)
        .map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  const incomeCategoryOptions = useMemo(
    () =>
      categories
        .filter((c) => !c.isExpense)
        .map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  const baseColumns = useMemo<TableColumn<Transaction>[]>(
    () => [
      { key: "date", name: "Date", type: "date", sortable: true, editable: true },
      { key: "title", name: "Title", type: "text", sortable: true, editable: true },
      { key: "amount", name: "Amount", type: "number", sortable: true, editable: true },
      { key: "parcelaAtual", name: "Current Parcel", type: "number", sortable: false, editable: true },
      { key: "parcelaTotal", name: "Total Parcels", type: "number", sortable: false, editable: true },
      { key: "description", name: "Description", type: "text", sortable: false, editable: true },
    ],
    []
  );

  const runQueryColumn = useMemo<TableColumn<Transaction>>(
    () => ({
      key: "run",
      name: "Actions",
      render: (_value, row) => (
        <Button
          size="sm"
          onClick={
            async () => {
              try {
                const resp = await transactionTemplatesApi.create({
                  title: row.title,
                  description: row.description,
                  categoryId: row.category ? (row.category as Category).id : undefined,
                });
                console.log(resp.data);
                // you can also set state or show a modal here
              } catch {
                console.error("Failed to run template query");
              }
            }
          }
        >
          Set default
        </Button >
      ),
    }),
    []
  );

  const expenseCategoryColumn = useMemo<TableColumn<Transaction>>(
    () => ({
      key: "category",
      name: "Category",
      type: "select",
      sortable: true,
      editable: false,
      render: (value, row) => {
        const selectedId = typeof value === 'object' && value !== null
          ? (value as Category).id
          : (value as number);
        return (
          <Form.Select
            size="sm"
            value={String(selectedId ?? "")}
            onChange={async (e) => {
              const newCatId = Number(e.currentTarget.value);
              setError(null);
              try {
                await transactionsApi.updateCategory(row.id, newCatId);
                fetchTransactions();
              } catch {
                setError("Failed to update category.");
              }
            }}
          >
            <option value="">–</option>
            {expenseCategoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Form.Select>
        );
      },
    }),
    [expenseCategoryOptions]
  );

  const incomeCategoryColumn = useMemo<TableColumn<Transaction>>(
    () => ({
      key: "category",
      name: "Category",
      type: "select",
      editable: false,
      render: (value, row) => {
        const selectedId = typeof value === 'object' && value !== null
          ? (value as Category).id
          : (value as number);
        return (
          <Form.Select
            size="sm"
            value={String(selectedId ?? "")}
            onChange={async (e) => {
              const newCatId = Number(e.currentTarget.value);
              setError(null);
              try {
                await transactionsApi.updateCategory(row.id, newCatId);
                fetchTransactions();
              } catch {
                setError("Failed to update category.");
              }
            }}
          >
            <option value="">–</option>
            {incomeCategoryOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Form.Select>
        );
      },
    }),
    [incomeCategoryOptions]
  );

  const expenseColumns = useMemo(
    () => [...baseColumns, expenseCategoryColumn, runQueryColumn],
    [baseColumns, expenseCategoryColumn, runQueryColumn]
  );

  const incomeColumns = useMemo(
    () => [...baseColumns, incomeCategoryColumn, runQueryColumn],
    [baseColumns, incomeCategoryColumn, runQueryColumn]
  );

  return (
    <div>
      <h2 className="mb-4">Transactions</h2>
      <UploadCsv userId={userId} onUploadSuccess={fetchTransactions} />

      <Row className="mb-3">
        <Col xs={6}>
          <Form.Group controlId="selectYear">
            <Form.Label>Year</Form.Label>
            <Form.Control as="select" name="year" value={currentYear} onChange={handleDateChange}>
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group controlId="selectMonth">
            <Form.Label>Month</Form.Label>
            <Form.Control as="select" name="month" value={currentMonth} onChange={handleDateChange}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {moment().month(i).format("MMMM")}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {loading && <div className="text-center"><Spinner animation="border" /> Loading…</div>}
      {error && <Alert variant="danger">{error}</Alert>}

      <h3 className="mt-4">Expenses</h3>
      {!loading && expenses.length === 0 && !error ? (
        <Alert variant="info">No expenses this month.</Alert>
      ) : (
        <Table
          data={expenses}
          columns={expenseColumns}
          idKey="id"
          onUpdateRow={handleUpdateTransaction}
          onDeleteRow={handleDeleteTransaction}
          onAddRow={handleAddTransaction}
          renderNewRow={(onAdd) => <NewTransactionRow onAdd={onAdd} categories={categories} />}
        />
      )}

      <h3 className="mt-5">Income</h3>
      {!loading && income.length === 0 && !error ? (
        <Alert variant="info">No income this month.</Alert>
      ) : (
        <Table
          data={income}
          columns={incomeColumns}
          idKey="id"
          onUpdateRow={handleUpdateTransaction}
          onDeleteRow={handleDeleteTransaction}
          onAddRow={handleAddTransaction}
          renderNewRow={(onAdd) => <NewTransactionRow onAdd={onAdd} categories={categories} />}
        />
      )}
    </div>
  );
};

export default TransactionsView;
