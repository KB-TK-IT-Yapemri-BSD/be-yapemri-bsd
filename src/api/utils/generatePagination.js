function GeneratePagination(limit, currentPage, totalDatas) {
  let totalPages = Math.ceil(totalDatas / limit);
  let nextPage = currentPage + 1;
  let prevPage = currentPage - 1;

  if (nextPage > totalPages) {
    nextPage = totalPages;
  }
  if (prevPage < 1) {
    prevPage = 1;
  }

  return {
    currentPage: parseInt(currentPage),
    nextPage: nextPage,
    prevPage: prevPage,
    totalPages: totalPages,
    totalRecords: totalDatas,
  };
}

module.exports = GeneratePagination;
