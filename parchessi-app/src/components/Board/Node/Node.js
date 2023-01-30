import { useContext, useEffect, useRef } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { colorsBase } from "../../../data/colors";
import { getOrder } from "../../../utils/name";
import Shape from "../Shape/Shape";
import css from "./Node.module.css";

const Node = (props) => {
  const {
    className,
    children,
    onMove,
    name,
    variant,
    color,
    backgroundColor,
    border,
    borderWidth,
    borderColor,
    borderRadius,
    boxShadow,
  } = props;

  const { game, nodeCoord, setNodeCoord } = useContext(GameContext);

  const styles = {};

  const moves = game.activeMoves.find((moves) => moves.some((move) => move.node === name));

  if (moves) {
    const move = moves.find((move) => move.node === name);
    const piece = getOrder(move.piece);
    const pieceId = Math.floor(piece / 4);
    styles.backgroundColor = colorsBase[pieceId];
    styles.animation = `${css.blink} 1000ms linear infinite`;
  }

  const classes = [className, css.node, css[variant]].join(" ");

  const nodeRef = useRef(null);

  useEffect(() => {
    const tmpNodeCoord = nodeCoord;

    tmpNodeCoord[name] = {
      top: nodeRef.current.offsetTop,
      left: nodeRef.current.offsetLeft,
      width: nodeRef.current.offsetWidth,
      height: nodeRef.current.offsetHeight,
    };

    setNodeCoord(tmpNodeCoord);

    // Deps
  }, [name, nodeCoord, setNodeCoord]);

  const handleNodeClick = () => onMove(moves);

  return (
    <div className={classes} style={styles} ref={nodeRef} onClick={handleNodeClick}>
      <Shape
        variant={variant}
        color={color}
        backgroundColor={backgroundColor}
        border={border}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius={borderRadius}
        boxShadow={boxShadow}
      >
        {children}
        {/* {name} */}
      </Shape>
    </div>
  );
};

export default Node;
