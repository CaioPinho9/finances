import React, { useState } from "react";
import { Form, Button, Alert, ListGroup, Badge, ProgressBar, Stack } from "react-bootstrap";
import { CsvType } from "../types/types";
import transactionsApi from "../api/transaction";

interface UploadCsvProps {
    userId: number;
    onUploadSuccess: () => void;
}

type ItemStatus = "pending" | "uploading" | "success" | "error";

type QueueItem = {
    file: File;
    status: ItemStatus;
    message?: string;
};

const UploadCsv: React.FC<UploadCsvProps> = ({ userId, onUploadSuccess }) => {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [csvType, setCsvType] = useState<CsvType>(CsvType.NUBANK_EXTRACT);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    const clearQueue = () => {
        setQueue([]);
        setProgress(0);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (files.length === 0) return;

        // Start a NEW batch every time user picks files again
        setQueue([]);        // clear previous queue
        setProgress(0);
        setError(null);
        setSuccess(null);

        const newItems = files.map(file => ({ file, status: "pending" as const }));
        setQueue(newItems);

        // allow re-picking the same file(s) later
        event.target.value = "";
    };


    const handleCsvTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCsvType(event.target.value as CsvType);
    };

    const removeFromQueue = (idx: number) => {
        setQueue(prev => prev.filter((_, i) => i !== idx));
    };

    const uploadSequentially = async () => {
        if (queue.length === 0) {
            setError("Selecione ao menos um arquivo CSV.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        setProgress(0);

        const next = [...queue];
        let successCount = 0;

        try {
            for (let i = 0; i < next.length; i++) {
                next[i].status = "uploading";
                setQueue([...next]);

                try {
                    await transactionsApi.uploadCsv(next[i].file, userId, csvType);
                    next[i].status = "success";
                    next[i].message = "Enviado";
                    successCount++;
                } catch (err: any) {
                    console.error("CSV upload error:", err);
                    next[i].status = "error";
                    next[i].message = err?.response?.data?.message || "Falha no upload";
                } finally {
                    setQueue([...next]);
                    setProgress(Math.round(((i + 1) / next.length) * 100));
                }
            }

            const failureCount = next.filter(it => it.status === "error").length;
            if (failureCount === 0) {
                setSuccess(`${successCount} arquivo(s) enviados com sucesso!`);
                onUploadSuccess();
            } else if (successCount > 0) {
                setError(`${failureCount} arquivo(s) falharam. Iniciando novo lote limpa a fila automática.`);
            } else {
                setError("Todos os uploads falharam. Iniciando novo lote limpa a fila automática.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-4 p-3 border rounded">
            <h4>Upload de CSVs de Transações (Lote)</h4>

            <Form>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Selecionar Arquivos CSV</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".csv"
                        multiple
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                </Form.Group>

                <Form.Group controlId="formCsvType" className="mb-3">
                    <Form.Label>Tipo de CSV</Form.Label>
                    <Form.Select value={csvType} onChange={handleCsvTypeChange} disabled={loading}>
                        {Object.values(CsvType).map(type => (
                            <option key={type} value={type}>
                                {type.replace(/_/g, " ")}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {queue.length > 0 && (
                    <>
                        <ListGroup className="mb-3">
                            {queue.map((item, idx) => (
                                <ListGroup.Item key={`${item.file.name}-${item.file.size}-${item.file.lastModified}`}>
                                    <Stack direction="horizontal" gap={2} className="justify-content-between align-items-center">
                                        <div>
                                            <div><strong>{item.file.name}</strong></div>
                                            <div className="text-muted" style={{ fontSize: 12 }}>
                                                {(item.file.size / 1024).toFixed(1)} KB
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {item.status === "pending" && <Badge bg="secondary">Pendente</Badge>}
                                            {item.status === "uploading" && <Badge bg="info">Enviando…</Badge>}
                                            {item.status === "success" && <Badge bg="success">Sucesso</Badge>}
                                            {item.status === "error" && <Badge bg="danger">Erro</Badge>}
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => removeFromQueue(idx)}
                                                disabled={loading && item.status === "uploading"}
                                                aria-label={`Remover ${item.file.name}`}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </Stack>
                                    {item.message && item.status !== "pending" && (
                                        <div className="mt-1" style={{ fontSize: 12 }}>
                                            {item.message}
                                        </div>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <div className="mb-3">
                            <ProgressBar now={progress} label={`${progress}%`} animated={loading} />
                        </div>
                    </>
                )}

                <div className="d-flex gap-2">
                    <Button
                        variant="primary"
                        onClick={uploadSequentially}
                        disabled={loading || queue.length === 0}
                    >
                        {loading ? "Enviando lote..." : `Enviar ${queue.length} arquivo(s)`}
                    </Button>

                    <Button variant="outline-secondary" onClick={clearQueue} disabled={loading || queue.length === 0}>
                        Limpar fila
                    </Button>
                </div>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {success && <Alert variant="success" className="mt-3">{success}</Alert>}
            </Form>
        </div>
    );
};

export default UploadCsv;
