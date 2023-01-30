import css from "./Shape.module.css";

const Shape = (props) => {
  const {
    className,
    children,
    variant,
    color,
    backgroundColor,
    border,
    borderWidth,
    borderColor,
    borderRadius,
    boxShadow,
  } = props;

  const classes = [className, css.shape, css[variant]].join(" ");

  const styles = {
    color: color || "#000000",
    backgroundColor: backgroundColor || "rgba(255,255,255,0.25)",
    border: border,
    borderWidth: borderWidth || "3px",
    borderColor: borderColor || "#000000",
    borderRadius: borderRadius || "0",
    boxShadow: boxShadow || "0 0 6px rgba(0, 0, 0, 0.25)",
  };

  return (
    <div className={classes} style={styles}>
      {children}
    </div>
  );
};

export default Shape;
