import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { monthYearLabel } from "../../../utils/format";
import type { MonthSummary } from "../../../types/types";

type MonthlyBarsProps = Readonly<{
  rows: MonthSummary[];
}>;

export default function MonthlyBars(props: MonthlyBarsProps) {
  const { rows } = props;

  const data = rows.map(m => ({
    name: monthYearLabel(m),
    Receitas: m.totalIncome ?? 0,
    Despesas: m.totalExpense ?? 0,
    Saldo: (m.totalIncome ?? 0) - (m.totalExpense ?? 0),
  }));

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
           <Bar dataKey="Receitas" stackId="a" fill="#4CAF50" /> {/* green */}
          <Bar dataKey="Despesas" stackId="a" fill="#F44336" /> {/* red */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
