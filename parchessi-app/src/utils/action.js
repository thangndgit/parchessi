import { getOrder } from "./name";
import { getMoveEnd, getMoveRacing, getMoveStart } from "./move";

export const skipTurn = (game) => {
  const tmpGame = structuredClone(game);

  tmpGame.dice = 0;
  tmpGame.roll = 1;
  tmpGame.activeMoves.length = 0;
  tmpGame.turn = tmpGame.nextTurn[tmpGame.turn];

  return tmpGame;
};

export const rollDice = (game) => {
  const tmpGame = structuredClone(game);

  const dice = Math.ceil(Math.random() * 6);

  tmpGame.dice = dice;
  tmpGame.activeMoves.length = 0;
  tmpGame.roll += (dice === 1 || dice === 6) - 1;

  const pieces = [
    "p-" + (tmpGame.turn * 4 + 0),
    "p-" + (tmpGame.turn * 4 + 1),
    "p-" + (tmpGame.turn * 4 + 2),
    "p-" + (tmpGame.turn * 4 + 3),
  ];

  pieces.forEach((piece) => {
    const moveStart = getMoveStart(tmpGame, piece);
    const moveRacing = getMoveRacing(tmpGame, piece);
    const moveEnd = getMoveEnd(tmpGame, piece);
    if (moveStart.length) tmpGame.activeMoves.push(moveStart);
    if (moveRacing.length) tmpGame.activeMoves.push(moveRacing);
    if (moveEnd.length) tmpGame.activeMoves.push(moveEnd);
  });

  return tmpGame;
};

export const executeMove = (game, moves) => {
  const tmpGame = structuredClone(game);

  moves.forEach((move) => {
    const pOrder = getOrder(move.piece);
    tmpGame.prevNode[pOrder] = tmpGame.currNode[pOrder];
    tmpGame.currNode[pOrder] = move.node;
  });

  tmpGame.activeMoves.length = 0;

  if (tmpGame.roll === 0) return skipTurn(tmpGame);

  return tmpGame;
};
