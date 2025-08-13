import { fmtBRL } from "../../utils/format";
import type { CategoryEntry } from "../../types/types";

interface CategoryTableProps {
    entries: CategoryEntry[];
    total: number;
    variant: "success" | "danger";
}

export default function CategoryTable(props: Readonly<CategoryTableProps>) {
    const { entries, total, variant } = props;

    const sorted = [...entries].sort((a, b) => b.total - a.total);
    return (
        <div className="table-responsive">
            <table className="table table-sm align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Categoria</th>
                        <th className="text-end">Valor</th>
                        <th style={{ width: 140 }}>Participação</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.length === 0 && (
                        <tr><td colSpan={3} className="text-muted text-center py-3">Sem dados</td></tr>
                    )}
                    {sorted.map((e, i) => {
                        const pct = total > 0 ? (e.total / total) * 100 : 0;
                        return (
                            <tr key={`${e.category?.id ?? "null"}-${i}`}>
                                <td>{e.category?.name ?? <span className="text-muted">Sem categoria</span>}</td>
                                <td className="text-end">{fmtBRL.format(e.total)}</td>
                                <td>
                                    <label className="visually-hidden" htmlFor={`progress-${i}`}>
                                        Participação de {e.category?.name ?? "Sem categoria"}: {pct.toFixed(1)}%
                                    </label>
                                    <progress
                                        id={`progress-${i}`}
                                        className={`progress-bar bg-${variant}`}
                                        value={pct}
                                        max={100}
                                        title={`${pct.toFixed(1)}%`}
                                        aria-label={`Participação de ${e.category?.name ?? "Sem categoria"}`}
                                        style={{ width: "100%" }}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    {total > 0 && (
                        <tr className="table-light">
                            <td className="fw-semibold">Total</td>
                            <td className="text-end fw-semibold">{fmtBRL.format(total)}</td>
                            <td />
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
