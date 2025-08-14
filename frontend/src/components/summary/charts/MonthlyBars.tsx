import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { monthYearLabel } from "../../../utils/format";
import type { MonthSummary } from "../../../types/types";

type MonthlyBarsProps = Readonly<{ rows: MonthSummary[] }>;

export default function MonthlyBars({ rows }: MonthlyBarsProps) {
  const data = rows.map(m => {
    const income = m.totalIncome ?? 0;
    const expense = m.totalExpense ?? 0;
    return {
      name: monthYearLabel(m),
      Saldo: income - expense,
    };
  });

  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={brl} />
          <Tooltip formatter={(value: number) => brl(value)} />
          <ReferenceLine y={0} stroke="#999" />
          <Bar dataKey="Saldo">
            {data.map((d, i) => (
              <Cell key={i} fill={d.Saldo >= 0 ? "#4CAF50" : "#F44336"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
