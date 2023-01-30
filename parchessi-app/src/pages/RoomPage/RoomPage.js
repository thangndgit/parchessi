import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Container from "../../components/UI/Container/Container";
import Table from "../../components/UI/Table/Table";
import api from "../../constants/api";
import { AuthContext } from "../../contexts/AuthContext";
import "./RoomPage.css";

const RoomPage = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);

  const { user } = useContext(AuthContext);

  const codeRef = useRef("");

  // Fetch func
  const fetchRooms = useCallback(async (search, apply = (data) => {}) => {
    try {
      let query = "";
      if (search) query = "?" + new URLSearchParams(search).toString();

      // Get response
      const res = await fetch(api.room.get(query), {
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
      apply(data);

      // Catch error
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // Run fetch
    fetchRooms(undefined, (data) => setRooms(data.rooms));

    // Deps
  }, [fetchRooms]);

  // Handle when click join room
  const handleJoinRoom = (e) => {
    // Prevent reloading page when submit form
    e.preventDefault();

    // Get code from input
    const code = codeRef.current.value.trim();

    // Run fetch
    fetchRooms({ code }, (data) => {
      if (data.rooms.length === 0) alert("Sai mã phòng");
      else navigate(`/game/${data.rooms[0]._id}`);
    });
  };

  // Handle when click create room
  const handleCreateRoom = async (e) => {
    // Prevent reloading page when submit form
    e.preventDefault();

    try {
      // Get response
      const res = await fetch(api.room.create(), {
        method: "POST",
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
      navigate(`/game/${data.created._id}`);

      // Catch error
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <div className="room-page">
          <h3 className="text-center">Danh sách phòng đang mở</h3>
          <div className="room-page__actions">
            <form onSubmit={handleJoinRoom}>
              <input type="text" placeholder="Nhập mã phòng . . ." ref={codeRef} required />
              <button type="submit">Vào phòng</button>
              <button onClick={handleCreateRoom}>Tạo phòng</button>
            </form>
          </div>
          <Table className="room-page__rooms">
            <thead>
              <tr>
                <th>Mã phòng</th>
                <th>Người chơi</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!rooms.length && (
                <tr>
                  <td colSpan={100}>Hiện chưa có phòng nào</td>
                </tr>
              )}
              {!!rooms.length &&
                rooms.map((room) => {
                  const realUsers = room.users.filter((u) => !!u.username);

                  return (
                    <tr key={room._id}>
                      <td>#{room.code}</td>
                      <td>{realUsers.map((u) => u.username).join(", ")}</td>
                      <td>{realUsers.length}/4</td>
                      <td>{room.isPlaying ? "Đang chơi" : "Đang chờ"}</td>
                      <td className="d-flex justify-content-center">
                        <button
                          className="d-flex"
                          onClick={() => {
                            if (room.isPlaying) alert("Game đã bắt đầu");
                            else if (realUsers.length === 4) alert("Phòng đã đủ người");
                            else if (realUsers.find((u) => u.username === user.username))
                              alert("Người chơi hiện đang ở trong phòng này");
                            else navigate(`/game/${room._id}`);
                          }}
                        >
                          <FaAngleDoubleRight />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            {/* <tfoot>
              <tr>
                <td colSpan={100}>
                  <Pagination onFetch={() => {}} />
                </td>
              </tr>
            </tfoot> */}
          </Table>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default RoomPage;
