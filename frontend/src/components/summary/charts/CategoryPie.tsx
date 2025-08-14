import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CategoryEntry } from "../../../types/types";

interface CategoryPieProps {
  data: CategoryEntry[];
  maxSlices?: number;      // keep top N, group the rest as "Outros"
  minLabelPct?: number;    // only label slices >= this %
}

const COLORS = ["#4CAF50","#F44336","#2196F3","#FFC107","#9C27B0","#FF9800","#795548","#607D8B","#E91E63"];

export default function CategoryPie({
  data,
  maxSlices = 6,
  minLabelPct = 0.06, // 6%
}: Readonly<CategoryPieProps>) {
  const raw = data.map(d => ({
    name: d.category?.name ?? "Sem categoria",
    value: d.total ?? 0,
  }));

  // 1) Keep top N and group the rest as "Outros"
  const sorted = [...raw].sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, maxSlices - 1);
  const tail = sorted.slice(maxSlices - 1);
  const othersTotal = tail.reduce((sum, r) => sum + r.value, 0);
  const chartData = othersTotal > 0 ? [...head, { name: "Outros", value: othersTotal }] : head;

  const total = chartData.reduce((s, r) => s + r.value, 0) || 1;
  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // 2) Only label slices >= threshold; no label lines
  const label = (p: any) => {
    const pct = p.value / total;
    if (pct < minLabelPct) return null;
    return `${p.name}: ${fmt(p.value)}`;
  };

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={85}
            label={label}
            labelLine={false}
            paddingAngle={1}
            minAngle={3}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip formatter={(v: number) => fmt(v)} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
