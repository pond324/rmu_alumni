const RegisSettingSkeleton = () => {
  return (
    <>
      {/* QR Payment */}
      <div className="w-full mt-5 shadow-sm rounded-lg bg-white animate-pulse">
        <div className="w-full p-3.5 border border-gray-200 rounded-t-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-gray-200" />

            <div className="flex flex-col gap-2">
              <div className="w-40 h-4 bg-gray-200 rounded" />
              <div className="w-56 h-3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div className="w-full border border-gray-200 border-t-0 rounded-b-lg flex gap-5 p-5">
          <div className="w-full h-85 lg:w-1/3 rounded-lg bg-gray-200" />

          <div className="flex-1 flex flex-col">
            <div className="w-72 h-4 bg-gray-200 rounded mb-4" />

            <div className="flex gap-2">
              <div className="w-24 h-10 bg-gray-200 rounded-lg" />
              <div className="w-24 h-10 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Amount Setting */}
      <div className="w-full mt-5 shadow-sm rounded-lg bg-white animate-pulse">
        <div className="w-full p-3.5 border border-gray-200 rounded-t-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-gray-200" />

            <div className="flex flex-col gap-2">
              <div className="w-52 h-4 bg-gray-200 rounded" />
              <div className="w-60 h-3 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        <div className="w-full border border-gray-200 border-t-0 rounded-b-lg p-5">
          <div className="w-20 h-4 bg-gray-200 rounded mb-3" />

          <div className="w-full md:w-1/2 lg:w-1/4 h-11 bg-gray-200 rounded-lg" />

          <div className="mt-5">
            <div className="w-24 h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisSettingSkeleton