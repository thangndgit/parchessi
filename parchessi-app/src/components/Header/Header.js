import { NavLink, useNavigate } from "react-router-dom";
import { FaChessKnight, FaRegistered, FaSignInAlt, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
import Container from "../UI/Container/Container";
import css from "./Header.module.css";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Header = (props) => {
  const { className } = props;

  const classList = [css.header, className];

  const navigate = useNavigate();

  const { user, isSignedIn, signOut } = useContext(AuthContext);

  return (
    <header className={classList.join(" ")}>
      <Container>
        <nav>
          <ul>
            <li onClick={() => navigate("/")}>
              <div className={css.logo}>
                Parchessi
                <FaChessKnight />
              </div>
            </li>
            <li className="spacer"></li>
            {!isSignedIn && (
              <>
                <li>
                  <NavLink to="/sign-in">
                    <FaSignInAlt />
                    <span>Đăng nhập</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/sign-up">
                    <FaRegistered />
                    <span>Đăng ký</span>
                  </NavLink>
                </li>
              </>
            )}
            {isSignedIn && (
              <>
                <li>
                  <NavLink to="/room">
                    <FaUsers />
                    <span>Phòng game</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/">
                    <FaUser />
                    <span>{user.username}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/sign-out" onClick={() => signOut(() => navigate("/"))}>
                    <FaSignOutAlt />
                    <span>Đăng xuất</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
