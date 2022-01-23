import React from 'react';
import './style.scss';

const Header = ({ children }) => {
  return (
    <header>
      {/* <img src={Logo} alt="Logo" /> */}
      <div className="menu">
        { children }
      </div>
    </header>
  );
}

export default Header;
