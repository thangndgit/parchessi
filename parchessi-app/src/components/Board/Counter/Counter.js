import { useState, useEffect } from "react";
import css from "./Counter.module.css";

const Counter = (props) => {
  const { className, onSkip, time } = props;

  const classCounter = [className, css.counter].join(" ");

  const [counter, setCounter] = useState(time);

  useEffect(() => {
    if (counter === 0) return;
    setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  useEffect(() => {
    if (counter > 0) return;
    onSkip();
    // setCounter(time);
  }, [counter, onSkip, time]);

  return <div className={classCounter}>{counter}</div>;
};

export default Counter;
