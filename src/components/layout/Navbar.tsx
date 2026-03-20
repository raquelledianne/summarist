"use client";

interface Props {
  openAuth: () => void;
}

export default function Navbar({ openAuth }: Props) {
  return (
    <nav className="nav">
      <div className="nav__wrapper">
        <figure className="nav__img--mask">
          <img className="nav__img" src="/logo.png" alt="logo" />
        </figure>

        <ul className="nav__list--wrapper">
          <li className="nav__list nav__list--login" onClick={openAuth}>
            Login
          </li>

          <li className="nav__list nav__list--mobile">About</li>
          <li className="nav__list nav__list--mobile">Contact</li>
          <li className="nav__list nav__list--mobile">Help</li>
        </ul>
      </div>
    </nav>
  );
}