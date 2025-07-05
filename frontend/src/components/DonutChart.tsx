interface DonutChartProps {
  value: number;
  max: number;
  label: string;
  color?: string;
}

const DonutChart = ({ value, max, label, color = "#facc15" }: DonutChartProps) => {
  const percent = (value / max) * 100;
  const strokeDasharray = `${percent} ${100 - percent}`;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
        <circle
          cx="21"
          cy="21"
          r="15.915"
          fill="transparent"
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth="2"
        />
        <circle
          cx="21"
          cy="21"
          r="15.915"
          fill="transparent"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
};

export default DonutChart;
