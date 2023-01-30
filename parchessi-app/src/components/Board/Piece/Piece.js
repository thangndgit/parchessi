import css from "./Piece.module.css";
import { Transition } from "react-transition-group";
import { useCallback, useContext, useEffect, useState } from "react";
import { GameContext } from "../../../contexts/GameContext";
import { nodesH, nodesLTR } from "../../../data/nodes";
import { imagesPiece } from "../../../data/images";

const Piece = (props) => {
  const { className, pieceId, onMove, name, prevNode, currNode } = props;

  const classPiece = [className, css.piece].join(" ");

  const { game, nodeCoord } = useContext(GameContext);

  const styles = {};

  const moves = game.activeMoves.find((moves) => moves.some((move) => move.piece === name));

  if (moves) styles.animation = `${css.blink} 1000ms linear infinite`;
  if (nodesLTR.includes(currNode)) styles.transform = "scaleX(-1)";

  const getCoord = useCallback(
    (node) => {
      const coord = nodeCoord[node];
      return {
        top: nodesH.includes(node) ? coord.top - coord.height / 2 + 23.5 + "px" : coord.top + coord.height - 70 + "px",
        left: coord.left + coord.width / 2 - 21.25 + "px",
        zIndex: coord.top,
      };
    },
    [nodeCoord]
  );

  const beforeTran = {
    transition: "top 500ms ease-in-out, left 500ms ease-in-out",
    ...getCoord(prevNode),
  };

  const [afterTran, setAfterTran] = useState({});

  useEffect(() => {
    setAfterTran({
      entering: { ...getCoord(currNode) },
      entered: { ...getCoord(currNode) },
    });
  }, [currNode, getCoord, nodeCoord, prevNode]);

  const handlePieceClick = () => onMove(moves);

  return (
    <>
      <Transition in={true} timeout={500}>
        {(state) => (
          <div
            className={classPiece}
            style={{ ...styles, ...beforeTran, ...afterTran[state] }}
            onClick={handlePieceClick}
          >
            <img src={imagesPiece[pieceId]} alt="piece" />
          </div>
        )}
      </Transition>
    </>
  );
};

export default Piece;
