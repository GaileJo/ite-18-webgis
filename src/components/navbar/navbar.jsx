import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import logo from '../../../public/pictures/logo.svg';

const Menu = () => (
  <>
    <p className=''>
      <a href='#home'>Home</a>
    </p>
    <p>
      <a href='#about'>About</a>
    </p>
    <p>
      <a href='#features'>Features</a>
    </p>
    <p>
      <a href='#map'>Map</a>
    </p>
  </>
);

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className='webgis__navbar'>
      <div className='webgis__navbar-links'>
        <div className='webgis__navbar-links_logo'>
          <img src={logo} alt='logo' style={{ width: '100px' }}></img>
        </div>
        <div className='webgis__navbar-links_container'>
          <Menu />
        </div>
      </div>
      <div className='webgis__navbar-menu'>
        {toggleMenu ? (
          <RiCloseLine
            color='#ffff'
            size={28}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color='#ffff'
            size={28}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className='webgis__navbar-menu_container scale-up-center'>
            <div className='webgis__navbar-menu_container-links'>
              <Menu />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
