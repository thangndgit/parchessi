import css from "./Table.module.css";

const Table = (props) => {
  const { children, className } = props;

  const classList = [css.table, className];

  return <table className={classList.join(" ")}>{children}</table>;
};

export default Table;
