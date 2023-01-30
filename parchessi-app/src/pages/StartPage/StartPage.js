import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Container from "../../components/UI/Container/Container";
import { AuthContext } from "../../contexts/AuthContext";
import { imagesIntro } from "../../data/images";
import "./StartPage.css";

const StartPage = () => {
  // Navigate
  const navigate = useNavigate();

  const { isSignedIn } = useContext(AuthContext);

  return (
    <>
      <Header />
      <Container>
        <div className="start-page">
          <h2 className="text-center">Cờ cá ngựa online</h2>
          {!isSignedIn && (
            <div className="start-page__buttons">
              <button onClick={() => navigate("/sign-in")}>Đăng nhập</button>
              <button onClick={() => navigate("/sign-up")}>Đăng ký</button>
            </div>
          )}
          <h5 className="start-page__title">Giới thiệu về game</h5>
          <div className="start-page__content">
            <b>Cờ cá ngựa </b>hay còn có tên gọi khác là cờ đua ngựa, có nguồn gốc từ Ấn Độ với tên ban đầu là Pachisi,
            sau đó được chuyển thể lại ở Mỹ với tên gọi Parcheesi. Khi du nhập về Việt Nam, nó có tên là Cờ cá ngựa.
            Game cờ cá ngựa có 2 phiên bản phổ biến là 1 xúc xắc và 2 xúc xắc, ở website này chúng tôi sử dụng luật chơi
            của phiên bản 1 xúc xắc.
          </div>
          <div className="start-page__content">
            Khi vào game mỗi người chơi sẽ được cung cấp 4 quân cờ với màu sắc khác nhau. Mỗi khi tới lượt, người chơi
            sẽ tung xúc xắc để di chuyển các quân cờ về đích. Mục tiêu của người chơi là đưa được cả 4 quân cờ của mình
            lên chuồng vào các ô 6, 5, 4, 3. Để đảm bảo thời lượng game hợp lý, khi có 1 người chơi đưa hết quân về
            chuồng, game sẽ kết thúc.
          </div>
          <h5 className="start-page__title">Một vài hình ảnh trong game</h5>
          <div className="start-page__images">
            {imagesIntro.map((img, id) => (
              <img src={img} key={id} alt="intro" />
            ))}
          </div>
          <h5 className="start-page__title">Luật chơi</h5>
          <div className="start-page__content">
            <b>Tung xúc xắc: </b>Mỗi khi tới lượt của mình, người chơi thực hiện tung xúc xắc. nếu tung được 1 hoặc 6,
            người chơi có quyền tung thêm 1 lần nữa. Lượt của người chơi được tính theo ngược chiều kim đồng hồ
          </div>
          <div className="start-page__content">
            <b>Xuất chuồng: </b>Là quyền đưa ra 1 quân cờ để tham gia di chuyển trên bàn cờ. Để thực hiện nước xuất
            chuồng, người chơi cần tung được 1 hoặc 6 điểm. Khi thực hiện nước xuất chuồng, quân cờ sẽ được đặt trước
            cửa chuồng. Nếu trong trường hợp có quân cờ của người khác ở vị trí xuất chuồng, thực hiện đá quân cờ đó về
            chuồng.
          </div>
          <div className="start-page__content">
            <b>Vào chuồng: </b>Khi quân cờ đi được tròn 1 vòng, đứng trước cửa chuồng, người chơi có quyển vào chuồng.
            Một khi đã vào chuồng người chơi sẽ không thể bị quân cờ của người khác đá. Khi đứng trước cửa chuồng, người
            chơi xúc được bao nhiêu điểm thì có thể lựa chọn vào chuồng tới ô có số tương ứng. Khi đã đang trong chuồng,
            người chơi cần lên chuồng từ từ (ví dụ khi người chơi muốn từ ô số 4 lên 6, phải đi lần lượt 4 - 5 - 6, muốn
            từ 4 lên 5 phải xúc được 1 hoặc 5, ...).
          </div>
          <div className="start-page__content">
            <b>Di chuyển: </b>Một khi trên bàn cờ đã có một quân cờ của mình được tham gia di chuyển thì ta có thể căn
            cứ vào kết quả của việc tung xúc xắc để di chuyển nó. Kết quả bao nhiêu thì đó là số bước phải di chuyển,
            không di chuyển nhiều hay ít hơn kết quả. Lưu ý không thể đi quá 1 vòng bàn cờ kể từ điểm xuất phát.
          </div>
          <div className="start-page__content">
            <b>Bị cản: </b>Nếu một quân cờ thực hiện số nước đi theo kết quả của xúc xắc mà trên đường từ vị trí cũ tới
            vị trí mới (bao gồm cả vị trí mới) có 1 quân cờ của bản thân, hoặc từ vị trí cũ tới vị trí mới (không bao
            gồm vị trí mới) có 1 quân cờ của đối phương thì sẽ là bị cản, quân cờ không thể di chuyển được.
          </div>
          <div className="start-page__content">
            <b>Đá: </b>Trong trường hợp quân cờ không bị cản và ở vị trí mới có 1 quân cờ của đối thủ, có thể thực hiện
            nước đi để đá quân cờ đó về chuồng, làm đối phương mất hết đoạn đường đã đi với quân cờ đó.
          </div>
          <div className="start-page__content">
            <b>Bỏ lượt: </b>Trong trường hợp tung được ra xúc xắc có thể đi được, nhưng không muốn đi vì lý do chiến
            thuật, người chơi có thể thực hiện bỏ lượt
          </div>
          <h5 className="start-page__title">Hướng dẫn thao tác</h5>
          <div className="start-page__content">
            <b>Tung xúc xắc: </b>Ấn vào nút tung xúc xắc hoặc ấn vào đồng hồ đếm ngược ở giữa bàn cờ. Mỗi người trong
            lượt của mình có 15s cho mỗi thao tác, mỗi khi thực hiện một thao tác hợp lệ sẽ được cộng thêm thời gian.
          </div>
          <div className="start-page__content">
            <b>Di chuyển: </b>Mỗi khi tung xúc xắc xong, game sẽ tự tính toán các nước đi hợp lệ và hiển thị ra cho
            người chơi. Để di chuyển, người chơi chỉ cần ấn vào quân cờ hoặc ô cờ đang nhấp nháy để thực hiện nước đi
            với quân cờ / tới ô cờ tương ứng.
          </div>
          <div className="start-page__content">
            <b>Bỏ lượt: </b>Người chơi ấn vào nút bỏ lượt
          </div>

          <h3 className="start-page__title">Chúc các bạn chơi game vui vẻ!</h3>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default StartPage;
