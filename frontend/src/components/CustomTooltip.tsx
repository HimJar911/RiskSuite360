const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-gray-800 text-white p-2 rounded border border-yellow-500 text-sm">
      <p className="font-semibold">{label}</p>
      <p>{payload[0].value}</p>
    </div>
  );
};

export default CustomTooltip;
