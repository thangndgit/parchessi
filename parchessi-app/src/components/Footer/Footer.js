import Container from "../UI/Container/Container";
import css from "./Footer.module.css";

const Footer = (props) => {
  const { className } = props;

  const classList = [css.footer, className];

  return (
    <footer className={classList.join(" ")}>
      <Container>
        <h3>THIS IS FOOTER</h3>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
