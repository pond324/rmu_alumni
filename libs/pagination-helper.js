export const forwardPage = (page, setPage, totalPage) => {
  if (page < totalPage) {
    setPage((prev) => prev + 1);
  }
};

export const prevPage = (page, setPage) => {
  if (page > 0) {
    setPage((prev) => prev - 1);
  }
};
