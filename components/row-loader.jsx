

const RowLoader = ({ numcol = 5, rows = 10 }) => {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          {Array.from({ length: numcol }).map((_, colIndex) => (
            <td key={colIndex} className="p-2.5 pb-3">
              <div className="h-8 bg-gray-200 rounded w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
export default RowLoader;
