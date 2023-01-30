import { useCallback, useContext, useEffect, useState } from "react";
import { FaDice, FaFlagCheckered, FaMinusCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Board from "../../components/Board/Board";
import Header from "../../components/Header/Header";
import Container from "../../components/UI/Container/Container";
import api from "../../constants/api";
import { AuthContext } from "../../contexts/AuthContext";
import { GameContext } from "../../contexts/GameContext";
import useSocket from "../../hooks/useSocket";
import "./GamePage.css";

const GamePage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { user } = useContext(AuthContext);
  const { updateGame, startCount, stopCount } = useContext(GameContext);
  const [room, setRoom] = useState({ users: [{}, {}, {}, {}] });
  const [logs, setLogs] = useState([]);

  const socket = useSocket(user);

  useEffect(() => {
    // Fetch func
    const fetchRoom = async () => {
      try {
        // Get response
        const res = await fetch(api.room.getById(params.gameId), {
          method: "GET",
          credentials: "include",
        });

        // Get data
        const data = await res.json();

        // Error handling
        if (data.error) {
          alert(data.error);
          return;
        }

        // Apply data
        if (data.room) setRoom(data.room);
        else {
          alert("Phòng không tồn tại");
          navigate("/room");
        }

        // Catch error
      } catch (error) {
        console.log(error);
      }
    };

    // Run fetch
    fetchRoom();

    // Deps
  }, [navigate, params.gameId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("server send log", (log) => setLogs([log, ...logs]));
  }, [logs, socket]);

  useEffect(() => {
    if (!socket) return;

    // Join room
    socket.on("server connect", () => socket.emit("client join room", params.gameId));

    // Handle join room
    socket.on("server join room", (err, u, joined) => {
      if (err) {
        alert(err.message || "Có lỗi xảy ra");
        navigate("/room");
      } else {
        socket.emit("client send log", `${u.username} vào phòng`, params.gameId);
        updateGame(joined.game, () => setRoom(joined));
      }
    });

    // Handle leave room
    socket.on("server leave room", (err, u, left) => {
      if (err) alert(err.message || "Có lỗi xảy ra");
      else {
        socket.emit("client send log", `${u.username} rời phòng`, params.gameId);
        updateGame(left.game, () => setRoom(left));
      }
    });

    // Handle start game
    socket.on("server start game", (err, started) => {
      if (err) alert(err.message || "Có lỗi xảy ra");
      else {
        socket.emit("client send log", "Game bắt đầu", params.gameId);
        setRoom(started);
        updateGame(started.game, startCount);
      }
    });

    // Handle start game
    socket.on("server stop game", (err, stopped) => {
      if (err) alert(err.message || "Có lỗi xảy ra");
      else {
        socket.emit("client send log", "Game kết thúc", params.gameId);
        setRoom(stopped);
        updateGame(stopped.game, stopCount);
      }
    });

    // Handle skip turn
    socket.on("server skip turn", (err, skipped) => {
      if (err) alert(err.message || "Có lỗi xảy ra");
      else {
        const game = skipped.game;
        const user = skipped.users[game.turn].username;

        socket.emit("client send log", `Lượt của ${user}`, params.gameId);
        updateGame(game, startCount);
      }
    });

    // Handle roll dice
    socket.on("server roll dice", (err, rolled) => {
      if (err) alert(err.message || "Có lỗi xảy ra");
      else {
        const game = rolled.game;
        const dice = game.dice;
        const user = rolled.users[game.turn].username;

        socket.emit("client send log", `${user} tung được ${dice} điểm`, params.gameId);
        updateGame(game, stopCount);

        if (game.activeMoves.length === 0 && game.roll === 0)
          setTimeout(() => socket.emit("client skip turn", params.gameId), 1000);
        else setTimeout(startCount, 1000);
      }
    });

    // Handle execute move
    socket.on("server execute move", (err, moved) => {
      if (err) alert(err.message || "Có lỗi xảy ra");
      else {
        const game = moved.game;
        updateGame(game, startCount);

        if (game.winners.length !== 0) {
          updateGame(game);
          alert(`${game.winners[0].username} đã chiến thắng`);
          socket.emit("client stop game", params.gameId);
        }
      }
    });

    return () => {
      socket.emit("client leave room", params.gameId);
    };

    // Deps
  }, [navigate, params.gameId, socket, startCount, stopCount, updateGame]);

  const handleStart = useCallback(() => socket.emit("client start game", params.gameId), [params.gameId, socket]);

  const handleSkip = useCallback(() => socket.emit("client skip turn", params.gameId), [params.gameId, socket]);

  const handleRoll = useCallback(() => socket.emit("client roll dice", params.gameId), [params.gameId, socket]);

  const handleMove = useCallback(
    (moves) => socket.emit("client execute move", params.gameId, moves),
    [params.gameId, socket]
  );

  return (
    <>
      <Header />
      <Container>
        <div className="game-page row g-3">
          <div className="game-page__game col-lg-8">
            <Board onRoll={handleRoll} onSkip={handleSkip} onMove={handleMove} room={room} />
          </div>
          <div className="game-page__control col-lg-4">
            <div className="control">
              <div className="control__room">
                <h5>Phòng #{room.code}</h5>
                <button
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Nếu rời phòng khi game chưa kết thúc, bạn sẽ bị xử thua. Bạn có chắc chắn muốn rời phòng không?"
                    );
                    if (confirmed) navigate("/room");
                  }}
                >
                  <MdClose />
                </button>
              </div>
              <div className="control__player">
                {room.users.map((u, id) => {
                  // Set username
                  let username = "Đang chờ";
                  if (room.isPlaying) username = "Trống";
                  if (u.username) username = u.username;

                  return (
                    <div className={`player player--${id}`} key={id}>
                      <div className="player__no">#{id + 1}</div>
                      <div className="player__name">{username}</div>
                    </div>
                  );
                })}
              </div>
              <div className="control__action">
                {!room.isPlaying && (
                  <button onClick={handleStart} className="col-span-2">
                    <FaFlagCheckered />
                    Bắt đầu
                  </button>
                )}
                {room.isPlaying && (
                  <>
                    <button onClick={handleRoll}>
                      <FaDice />
                      Tung xúc xắc
                    </button>
                    <button onClick={handleSkip}>
                      <FaMinusCircle />
                      Bỏ lượt
                    </button>
                  </>
                )}
              </div>
              <div className="control__logs mt-2">
                <h5>Nhật ký phòng</h5>
                <div className="logs-box mt-3">
                  {logs.map((log, id) => (
                    <div key={id}>{"> " + log}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default GamePage;
