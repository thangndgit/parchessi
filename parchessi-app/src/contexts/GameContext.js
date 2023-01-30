import { createContext, useCallback, useState } from "react";
import { defaultNodeCoord, defaultGame } from "../data/default";

export const GameContext = createContext();

export const GameProvider = (props) => {
  const { children } = props;

  const [game, setGame] = useState(defaultGame);

  const [nodeCoord, setNodeCoord] = useState(defaultNodeCoord);

  const [isCounting, setIsCounting] = useState(false);

  const startCount = useCallback(() => setIsCounting(true), []);
  const stopCount = useCallback(() => setIsCounting(false), []);

  const updateGame = useCallback((game, cb = () => {}) => {
    setGame(game);
    cb();
  }, []);

  return (
    <GameContext.Provider
      value={{
        game,
        updateGame,
        nodeCoord,
        setNodeCoord,
        isCounting,
        startCount,
        stopCount,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
