import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { CsvType } from '../types/types';
import transactionsApi from '../api/transaction';

interface UploadCsvProps {
    userId: number;
    onUploadSuccess: () => void;
}

const UploadCsv: React.FC<UploadCsvProps> = ({ userId, onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [csvType, setCsvType] = useState<CsvType>(CsvType.NUBANK_EXTRACT);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleCsvTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCsvType(event.target.value as CsvType);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Please select a file to upload.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await transactionsApi.uploadCsv(selectedFile, userId, csvType);
            setSuccess('CSV uploaded successfully!');
            setSelectedFile(null);
            onUploadSuccess();
        } catch (err) {
            setError('Failed to upload CSV. Please try again.');
            console.error('CSV upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-4 p-3 border rounded">
            <h4>Upload Transactions CSV</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Select CSV File</Form.Label>
                    <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
                </Form.Group>

                <Form.Group controlId="formCsvType" className="mb-3">
                    <Form.Label>CSV Type</Form.Label>
                    <Form.Select value={csvType} onChange={handleCsvTypeChange}>
                        {Object.values(CsvType).map(type => (
                            <option key={type} value={type}>
                                {type.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading || !selectedFile}>
                    {loading ? 'Uploading...' : 'Upload CSV'}
                </Button>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {success && <Alert variant="success" className="mt-3">{success}</Alert>}
            </Form>
        </div>
    );
};

export default UploadCsv;