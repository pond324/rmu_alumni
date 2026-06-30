export default function ChartSimpleSkeleton() {
  return (
    <div className="w-full h-[500px] p-5 animate-pulse">
      {/* Chart Area */}
      <div className="h-full flex items-end justify-between border-l border-b border-gray-200 pl-4 pb-16">
        <div className="w-12 h-[40%] bg-gray-200 rounded-t-lg" />
        <div className="w-12 h-[65%] bg-gray-200 rounded-t-lg" />
        <div className="w-12 h-[30%] bg-gray-200 rounded-t-lg" />
        <div className="w-12 h-[80%] bg-gray-200 rounded-t-lg" />
        <div className="w-12 h-[55%] bg-gray-200 rounded-t-lg" />
        <div className="w-12 h-[70%] bg-gray-200 rounded-t-lg" />
        <div className="w-12 h-[45%] bg-gray-200 rounded-t-lg" />
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between mt-3 px-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="w-12 h-3 bg-gray-200 rounded"
          />
        ))}
      </div>
    </div>
  );
}