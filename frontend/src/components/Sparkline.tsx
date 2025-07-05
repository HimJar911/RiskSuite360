import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
}

const Sparkline = ({ data, color = "#facc15" }: SparklineProps) => {
  const formattedData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-gray-800 px-2 py-1 rounded text-xs border border-gray-600">
                    {payload[0].value?.toFixed(2)}
                  </div>
                );
              }
              return null;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;
