import { useEffect, useCallback, useMemo, useState } from "react";
import { fetchSummaryRange } from "../api/summaryApi";
import MonthlyBars from "../components/summary/charts/MonthlyBars";
import DateRangeForm from "../components/summary/DateRangeForm";
import MonthPanel from "../components/summary/MonthlyPanel";
import type { MonthSummary } from "../types/types";
import { toYYYYMM } from "../utils/format";

export default function SummaryPage() {
    const today = useMemo(() => new Date(), []);
    const defaultDate = useMemo(() => {
        const d = new Date(today);
        return toYYYYMM(d);
    }, [today]);

    const [date, setDate] = useState(defaultDate);
    const [rows, setRows] = useState<MonthSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const start = new Date(date + "-01");
            start.setMonth(start.getMonth() - 1);
            const startMonth = toYYYYMM(start);
            const data = await fetchSummaryRange(startMonth, date);
            setRows(data);
        } catch (e: unknown) {
            console.error(e);
            setError("Falha ao carregar o resumo.");
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => { load(); }, [load]); // load on mount

    return (
        <div className="container py-3">
            <h5 className="mb-3">Resumo por mês</h5>
            <DateRangeForm startMonth={date} endMonth={date} onChangeStart={setDate} onSubmit={load} loading={loading} />
            {error && <div className="alert alert-danger py-2">{error}</div>}

            {rows.length > 0 && (
                <div className="mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="mb-3">Receitas vs Despesas (por mês)</h6>
                            <MonthlyBars rows={rows} />
                        </div>
                    </div>
                </div>
            )}

            <div className="accordion" id="summaryAccordion">
                {rows.map((monthSummary, i) => (
                    <MonthPanel
                        key={`${monthSummary.year}-${monthSummary.month}-${i}`}
                        monthSummary={monthSummary}
                        defaultOpen={i === 0}
                    />
                ))}
            </div>
        </div>
    );
}
