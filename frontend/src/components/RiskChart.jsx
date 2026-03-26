import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = ["#ef4444", "#facc15", "#22c55e"];

const RiskChart = ({ data }) => {

  const chartData = [
    {
      name: "High",
      value: data.filter(f => f.risk_level === "HIGH").length
    },
    {
      name: "Medium",
      value: data.filter(f => f.risk_level === "MEDIUM").length
    },
    {
      name: "Low",
      value: data.filter(f => f.risk_level === "LOW").length
    }
  ];

  return (
    <div className="flex justify-center items-center">
      <PieChart width={300} height={250}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default RiskChart;
