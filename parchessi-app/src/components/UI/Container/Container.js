import css from "./Container.module.css";

const Container = (props) => {
  const { children, className } = props;

  const classList = [css.container, className];

  return <div className={classList.join(" ")}>{children}</div>;
};

export default Container;
