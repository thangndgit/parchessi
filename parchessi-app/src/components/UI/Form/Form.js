import css from "./Form.module.css";

const Form = (props) => {
  const { children, className, title, onSubmit } = props;

  const classList = [css.form, className];

  return (
    <div className={classList.join(" ")}>
      <h1>{title}</h1>
      <form onSubmit={onSubmit}>{children}</form>
    </div>
  );
};

export default Form;
