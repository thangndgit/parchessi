import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Container from "../../components/UI/Container/Container";
import Form from "../../components/UI/Form/Form";
import { AuthContext } from "../../contexts/AuthContext";
import "./SignInPage.css";

const SignInPage = () => {
  // Navigate
  const navigate = useNavigate();

  // Sign in
  const { signIn } = useContext(AuthContext);

  // Input refs
  const usernameRef = useRef("");
  const passwordRef = useRef("");

  // Handle when submit sign in form
  const handleSignIn = (e) => {
    // Prevent default
    e.preventDefault();

    // Get inputs value
    const username = usernameRef.current.value.trim();
    const email = usernameRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    // Sign in data
    const data = { username, email, password };

    // If everything is fine, sign in
    signIn(data, () => navigate("/room"));
  };

  return (
    <>
      <Header />
      <Container>
        <div className="sign-in-page">
          <Form title="Đăng nhập" onSubmit={handleSignIn}>
            <input type="text" placeholder="Nhập tên tài khoản" ref={usernameRef} />
            <input type="password" placeholder="Nhập mật khẩu" ref={passwordRef} />
            <button type="submit">Đăng nhập</button>
            <div className="text-center mt-3">
              Bạn chưa có tài khoản? Đăng ký ngay <Link to="/sign-up">tại đây</Link>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default SignInPage;
