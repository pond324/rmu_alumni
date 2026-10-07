import { Skeleton } from "./skeletons";

const RowLoader = ({ numcol = 5, numCol, rows = 8 }) => {
  const actualCols = numCol || numcol || 5;

  return (
    <>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
        >
          {Array.from({ length: actualCols }).map((_, colIndex) => {
            // Give each column a natural look (first column avatar/text, others varied widths)
            if (colIndex === 0) {
              return (
                <td key={colIndex} className="p-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-4 w-28 sm:w-36 rounded" />
                      <Skeleton className="h-3 w-16 sm:w-20 rounded" />
                    </div>
                  </div>
                </td>
              );
            }

            if (colIndex === actualCols - 1) {
              return (
                <td key={colIndex} className="p-3 text-right">
                  <Skeleton className="h-8 w-20 ml-auto rounded-lg" />
                </td>
              );
            }

            const widths = ["w-3/4", "w-1/2", "w-2/3", "w-4/5", "w-16"];
            const chosenWidth = widths[(rowIndex + colIndex) % widths.length];

            return (
              <td key={colIndex} className="p-3">
                <Skeleton className={`h-4.5 ${chosenWidth} rounded-md`} />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
};

export default RowLoader;
