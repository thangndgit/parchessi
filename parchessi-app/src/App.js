import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./contexts/AuthContext";
import { GameProvider } from "./contexts/GameContext";
import GamePage from "./pages/GamePage/GamePage";
import RoomPage from "./pages/RoomPage/RoomPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import StartPage from "./pages/StartPage/StartPage";
import UserPage from "./pages/UserPage/UserPage";

function App() {
  const { isSignedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        {!isSignedIn && (
          <>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </>
        )}
        {isSignedIn && (
          <>
            <Route path="/room" element={<RoomPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route
              path="/game/:gameId"
              element={
                <GameProvider>
                  <GamePage />
                </GameProvider>
              }
            />
          </>
        )}
        <Route path="*" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
