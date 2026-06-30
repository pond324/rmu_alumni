const ProgressbarDowload = ({ progress}) => {
//   console.log("🚀 ~ ProgressbarDowload ~ progress:", progress)
  return (
    <div className="w-full flex flex-col items-center gap-1">
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress || 0}%` }}
        />
      </div>

      <p>{progress || 0}%</p>
    </div>
  );
};
export default ProgressbarDowload;
