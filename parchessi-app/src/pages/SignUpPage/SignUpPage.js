import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Container from "../../components/UI/Container/Container";
import Form from "../../components/UI/Form/Form";
import { AuthContext } from "../../contexts/AuthContext";
import "./SignUpPage.css";

const SignUpPage = () => {
  // Navigate
  const navigate = useNavigate();

  // Sign up
  const { signUp } = useContext(AuthContext);

  // Input refs
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const password1Ref = useRef("");
  const password2Ref = useRef("");

  // Handle when submit sign up form
  const handleSignUp = (e) => {
    // Prevent default
    e.preventDefault();

    // Get inputs value
    const username = usernameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password1 = password1Ref.current.value.trim();
    const password2 = password2Ref.current.value.trim();

    // If password 1 does not match password 2
    if (password1 !== password2) {
      alert("Mật khẩu không khớp");
      return;
    }

    // Sign up data
    const data = { username, email, password: password1 };

    // If everything is fine, sign up
    signUp(data, () => navigate("/sign-in"));
  };

  return (
    <>
      <Header />
      <Container>
        <div className="sign-up-page">
          <Form title="Đăng ký" onSubmit={handleSignUp}>
            <input type="text" placeholder="Nhập tên tài khoản" ref={usernameRef} required />
            <input type="email" placeholder="Nhập địa chỉ email" ref={emailRef} required />
            <input type="password" placeholder="Nhập mật khẩu" ref={password1Ref} required />
            <input type="password" placeholder="Xác nhận lại mật khẩu" ref={password2Ref} required />
            <button type="submit">Đăng ký</button>
            <div className="text-center mt-3">
              Bạn đã có tài khoản? Đăng nhập ngay <Link to="/sign-in">tại đây</Link>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default SignUpPage;
