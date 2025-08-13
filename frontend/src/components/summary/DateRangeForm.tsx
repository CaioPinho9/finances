// src/components/DateRangeForm.tsx
import { useEffect, useMemo, useState } from "react";
import { format, setMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = {
    startMonth: string; // "YYYY-MM"
    endMonth: string;   // "YYYY-MM"
    onChangeStart: (v: string) => void;
    onSubmit: () => void;
    loading?: boolean;
};

function splitYm(ym: string) {
    const [y, m] = (ym || "").split("-");
    return { y: y ?? "", m: m ?? "" };
}
function joinYm(y?: string, m?: string) {
    if (!y || !m) return "";
    return `${y}-${m}`;
}
function ymToInt(y: string, m: string) {
    if (!y || !m) return NaN;
    return Number(y) * 100 + Number(m);
}

export default function DateRangeForm(props: Readonly<Props>) {
    const { startMonth, endMonth, onChangeStart, onSubmit, loading } = props;

    // Local, partial-friendly state (lets user choose month or year first)
    const [{ y: syProp, m: smProp }, setStartProp] = useState(splitYm(startMonth));
    const [{ y: eyProp, m: emProp }, setEndProp] = useState(splitYm(endMonth));

    // Keep local state in sync if parent props change externally
    useEffect(() => setStartProp(splitYm(startMonth)), [startMonth]);
    useEffect(() => setEndProp(splitYm(endMonth)), [endMonth]);

    // Months 01–12 with localized labels
    const months = useMemo(() => (
        Array.from({ length: 12 }, (_, i) => {
            const date = setMonth(new Date(2020, 1, 1), i); // fixed base year to avoid month name drift
            return {
                v: String(i + 1).padStart(2, "0"),
                label: format(date, "MMMM", { locale: ptBR }),
            };
        })
    ), []);

    // Year options centered around current, but ensure selected years are present
    const years = useMemo(() => {
        const curr = new Date().getFullYear();
        const base = Array.from({ length: 11 }, (_, i) => curr - 5 + i);
        const selected = [syProp, eyProp].filter(Boolean).map(Number);
        const set = new Set([...base, ...selected]);
        return Array.from(set).sort((a, b) => a - b).map(String);
    }, [syProp, eyProp]);

    // Emitters only when both parts are chosen
    const setStartYear = (y: string) => {
        const next = { y, m: smProp };
        setStartProp(next);
        const joined = joinYm(next.y, next.m);
        if (joined) onChangeStart(joined);
    };
    const setStartMonth = (m: string) => {
        const next = { y: syProp, m };
        setStartProp(next);
        const joined = joinYm(next.y, next.m);
        if (joined) onChangeStart(joined);
    };

    // Validation: require both YM and end >= start
    const isComplete = syProp && smProp && eyProp && emProp;
    const startInt = ymToInt(syProp, smProp);
    const endInt = ymToInt(eyProp, emProp);
    const isRangeValid = isComplete && !Number.isNaN(startInt) && !Number.isNaN(endInt) && endInt >= startInt;

    return (
        <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
            {/* Start */}
            <div className="d-flex flex-column">
                <label className="form-label mb-1">Início (mês/ano)</label>
                <div className="d-flex gap-2">
                    <select
                        className="form-select"
                        aria-label="Ano inicial"
                        value={syProp}
                        onChange={(e) => setStartYear(e.target.value)}
                        disabled={loading}
                    >
                        {!syProp && <option value="">Ano</option>}
                        {years.map((y) => (
                            <option key={`sy-${y}`} value={y}>{y}</option>
                        ))}
                    </select>
                    <select
                        className="form-select"
                        aria-label="Mês inicial"
                        value={smProp}
                        onChange={(e) => setStartMonth(e.target.value)}
                        disabled={loading}
                    >
                        {!smProp && <option value="">Mês</option>}
                        {months.map((m) => (
                            <option key={`sm-${m.v}`} value={m.v}>{m.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={loading || !isRangeValid}
                title={!isRangeValid && isComplete ? "O fim deve ser posterior ou igual ao início" : undefined}
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Carregando…
                    </>
                ) : (
                    "Atualizar"
                )}
            </button>
        </div>
    );
}
