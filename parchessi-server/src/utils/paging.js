// Paging util function
const paging = (items, page, pageSize) => {
  // Calculate first and last index of output array
  const indexFirst = page * pageSize - pageSize;
  const indexLast = page * pageSize;
  // Split array
  const pagedItems = items.slice(indexFirst, indexLast);
  // Create paged object
  const paged = {
    page: page,
    page_size: pageSize,
    page_count: Math.ceil(items.length / pageSize),
    item_count: items.length,
    items: pagedItems,
  };
  // Return paged object
  return paged;
};

module.exports = paging;
