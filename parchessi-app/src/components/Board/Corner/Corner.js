import { FaArrowAltCircleDown, FaArrowAltCircleLeft, FaArrowAltCircleRight, FaArrowAltCircleUp } from "react-icons/fa";

import css from "./Corner.module.css";
import Shape from "../Shape/Shape";
import Node from "../Node/Node";
import { useContext } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { colorsActive, colorsBase } from "../../../data/colors";
import { namesNodeA, namesNodeB } from "../../../data/names";

const BoardCorner = (props) => {
  const { className, onMove, cornerId } = props;

  const classCorner = [className, css.corner, css[`corner--${cornerId}`]].join(" ");

  const color = colorsBase[cornerId];
  const activeColor = colorsActive[cornerId];

  const icons = [
    <FaArrowAltCircleDown fill={color} size="auto" className="p-min" />,
    <FaArrowAltCircleRight fill={color} size="auto" className="p-min" />,
    <FaArrowAltCircleUp fill={color} size="auto" className="p-min" />,
    <FaArrowAltCircleLeft fill={color} size="auto" className="p-min" />,
  ];

  const { game } = useContext(GameContext);

  const styles =
    game.turn !== Number(cornerId)
      ? {}
      : {
          backgroundColor: activeColor,
          animation: `${css.blink} 1000ms linear infinite`,
        };

  return (
    <div className={classCorner}>
      {namesNodeB[cornerId].map((name) => (
        <Node variant="circle" borderColor={color} name={name} onMove={onMove} key={name}>
          {name === `b-${cornerId * 14 + 1}` && icons[cornerId]}
        </Node>
      ))}
      <div className={css.cage} style={styles}>
        <Shape
          variant="square"
          color={color}
          borderWidth="3.75px"
          borderColor={color}
          borderRadius="6px"
          className="p-3"
        >
          <Shape variant="circle" color={color} borderWidth="3.75px" borderColor={color}>
            <div className={css.chair}>
              {namesNodeA[cornerId].map((name) => (
                <Node variant="circle" border="none" name={name} onMove={onMove} key={name} />
              ))}
            </div>
          </Shape>
        </Shape>
      </div>
    </div>
  );
};

export default BoardCorner;
