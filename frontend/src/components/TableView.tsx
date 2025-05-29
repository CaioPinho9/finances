import { useState } from "react";
import { HistoricColumns, HistoricEntry, updateHistoric } from "../api/historic";

interface Props {
    data: HistoricEntry[];
    setData: React.Dispatch<React.SetStateAction<HistoricEntry[]>>;
}

type SortKey = keyof HistoricEntry;
type SortDirection = "asc" | "desc";

export default function TableView({ data, setData }: Props) {
    const [editing, setEditing] = useState<Record<string, Partial<HistoricEntry>>>({});
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    console.log(data);


    const handleChange = (uuid: string, field: keyof HistoricEntry, value: any) => {
        setEditing((prev) => ({
            ...prev,
            [uuid]: { ...prev[uuid], [field]: value },
        }));
    };

    const handleBlur = (uuid: string, field: keyof HistoricEntry) => {
        const value = editing[uuid]?.[field];
        if (value !== undefined) {
            updateHistoric({ uuid, [field]: value });

            setData((prevData: HistoricEntry[]) =>
                prevData.map((entry: HistoricEntry) =>
                    entry.uuid === uuid ? { ...entry, [field]: value } : entry
                )
            );
        }

        // Exit editing mode
        setEditing((prev) => {
            const updated = { ...prev };
            delete updated[uuid]?.[field];
            if (Object.keys(updated[uuid] || {}).length === 0) {
                delete updated[uuid];
            }
            return updated;
        });
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;

        const valA = a[sortKey];
        const valB = b[sortKey];

        if (typeof valA === "number" && typeof valB === "number") {
            return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        if (typeof valA === "string" && typeof valB === "string") {
            return sortDirection === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        }

        return 0;
    });

    const renderSortArrow = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortDirection === "asc" ? " ▲" : " ▼";
    };

    const currencyFormatter = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return (
        <table className="table table-bordered table-hover mt-3">
            <thead className="table-light">
                <tr>
                    <th onClick={() => handleSort(HistoricColumns.date)}>
                        Data{renderSortArrow(HistoricColumns.date)}
                    </th>
                    <th onClick={() => handleSort(HistoricColumns.amount)} style={{ cursor: "pointer" }}>
                        Valor{renderSortArrow(HistoricColumns.amount)}
                    </th>
                    <th onClick={() => handleSort(HistoricColumns.description_bank)}>
                        Descrição Banco{renderSortArrow(HistoricColumns.description_bank)}
                    </th>
                    <th onClick={() => handleSort(HistoricColumns.description_custom)} style={{ cursor: "pointer" }}>
                        Descrição{renderSortArrow(HistoricColumns.description_custom)}
                    </th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row) => (
                    <tr key={row.uuid}>
                        <td>{row.date}</td>
                        <td>
                            {editing[row.uuid]?.amount !== undefined ? (
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    style={{ height: "30px" }}
                                    value={editing[row.uuid]?.amount}
                                    onChange={(e) =>
                                        handleChange(row.uuid, HistoricColumns.amount, parseFloat(e.target.value))
                                    }
                                    onBlur={() => handleBlur(row.uuid, HistoricColumns.amount)}
                                    aria-label="Valor"
                                    placeholder="Valor"
                                    autoFocus
                                />

                            ) : (
                                <span
                                    onClick={() =>
                                        setEditing((prev) => ({
                                            ...prev,
                                            [row.uuid]: { ...prev[row.uuid], amount: row.amount },
                                        }))
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    {currencyFormatter.format(row.amount)}
                                </span>
                            )}
                        </td>
                        <td style={{ width: '300px' }}>{row.description_bank}</td>
                        <td>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ height: "30px" }}
                                value={editing[row.uuid]?.description_custom ?? row.description_custom}
                                onChange={(e) =>
                                    handleChange(row.uuid, HistoricColumns.description_custom, e.target.value)
                                }
                                onBlur={() => handleBlur(row.uuid, HistoricColumns.description_custom)}
                                aria-label="Descrição"
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
