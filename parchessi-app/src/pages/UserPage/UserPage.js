import { useContext, useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Container from "../../components/UI/Container/Container";
import "./UserPage.css";
import useSocket from "../../hooks/useSocket";
import { AuthContext } from "../../contexts/AuthContext";

const UserPage = () => {
  const [msgs, setMsgs] = useState([]);

  const refMsg = useRef("");

  const { user } = useContext(AuthContext);

  const socket = useSocket(user);

  useEffect(() => {
    if (!socket) return;

    socket.on("serverSendMsg", (msg) => setMsgs([msg, ...msgs]));
  }, [msgs, socket]);

  useEffect(() => {
    if (!socket) return;
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSendMsg = (e) => {
    e.preventDefault();
    socket.emit("clientSendMsg", refMsg.current.value.trim());
  };

  return (
    <>
      <Header />
      <Container>
        <div className="room-page">
          <h3 className="text-center">Test Socket.io</h3>
          <div className="room-page__actions">
            <form onSubmit={handleSendMsg}>
              <input type="text" placeholder="Nhập tin nhắn . . ." ref={refMsg} />
              <button type="submit">Gửi tin nhắn</button>
            </form>
          </div>
          <div>
            {msgs.map((msg, id) => (
              <p key={id}>{msg}</p>
            ))}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default UserPage;
