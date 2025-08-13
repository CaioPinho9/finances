import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryEntry } from "../../../types/types";

interface CategoryPieProps {
  data: CategoryEntry[];
}

const COLORS = [
  "#4CAF50", // green
  "#F44336", // red
  "#2196F3", // blue
  "#FFC107", // amber
  "#9C27B0", // purple
  "#FF9800", // orange
  "#795548", // brown
  "#607D8B", // blue grey
  "#E91E63", // pink
];

// No fixed colors required; Recharts uses defaults. You can pass a palette if you want later.
export default function CategoryPie(props: Readonly<CategoryPieProps>) {
  const { data } = props;

  const chartData = data.map(d => ({ name: d.category?.name ?? "Sem categoria", value: d.total }));
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={85} label>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {chartData.map((_, i) => <Cell key={i} />)}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
