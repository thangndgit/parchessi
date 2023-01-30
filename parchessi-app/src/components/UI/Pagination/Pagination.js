import { useEffect, useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

import css from "./Pagination.module.css";

const Pagination = (props) => {
  const { className, onFetch } = props;

  const classList = [css.pagination, className];

  // Current page state
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [itemCount, setItemCount] = useState(0);

  // Fetch data when page change
  useEffect(() => {
    onFetch(page, (data) => {
      setPage(data.page);
      setPageCount(data.page_count);
      setItemCount(data.item_count);
    });
  }, [onFetch, page]);

  // Handle when click next page
  const handleNextPage = () => {
    if (page >= pageCount) return;
    setPage(page + 1);
  };

  // Handle when click prev page
  const handlePrevPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  return (
    <div className={classList.join(" ")}>
      <span>1-3 của 10</span>
      <span onClick={handlePrevPage}>
        <RiArrowLeftSLine />
      </span>
      <span onClick={handleNextPage}>
        <RiArrowRightSLine />
      </span>
    </div>
  );
};

export default Pagination;
