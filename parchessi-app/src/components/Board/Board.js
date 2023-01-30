import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { GameContext } from "../../contexts/GameContext";
import { imagesDice } from "../../data/images";
import Counter from "../Board/Counter/Counter";
import css from "./Board.module.css";
import Cage from "./Cage/Cage";
import Corner from "./Corner/Corner.js";
import Piece from "./Piece/Piece";

const Board = (props) => {
  const { className, onRoll, onSkip, onMove, room } = props;

  const { user } = useContext(AuthContext);
  const { game, isCounting } = useContext(GameContext);

  const classes = [className, css.board].join(" ");

  return (
    <div className={classes} id="board">
      <div>
        <Corner cornerId="0" onMove={onMove} />
        <Cage cageId="0" onMove={onMove} />
        <Corner cornerId="3" onMove={onMove} />
        <Cage cageId="1" onMove={onMove} />
        <div className={css.center} onClick={onRoll}>
          {!(isCounting && user.username === room.users[game.turn].username) && (
            <img src={imagesDice[game.dice]} key={game.dice} alt="center" width="100%" height="100%" />
          )}
          {isCounting && user.username === room.users[game.turn].username && (
            <Counter time="15" onSkip={onSkip} key={Math.random()} />
          )}
        </div>
        <Cage cageId="3" onMove={onMove} />
        <Corner cornerId="1" onMove={onMove} />
        <Cage cageId="2" onMove={onMove} />
        <Corner cornerId="2" onMove={onMove} />
      </div>
      <div>
        {game.currNode.map((node, id) => {
          const pieceIds = room.users
            .map((u, i) => {
              if (u.username) return i;
              else return -1;
            })
            .filter((pI) => pI !== -1);

          const pieceId = Math.floor(id / 4);

          if (pieceIds.includes(pieceId))
            return (
              <Piece
                pieceId={pieceId}
                name={`p-${id}`}
                currNode={node}
                prevNode={game.prevNode[id]}
                onMove={onMove}
                key={node}
              />
            );

          return null;
        })}
      </div>
    </div>
  );
};

export default Board;
