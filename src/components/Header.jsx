import { 
  NavLink, 
  useLocation 
} from 'react-router-dom';
import { useContext } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { HamburgerContext } from './Layout';
import { TbLayoutListFilled } from 'react-icons/tb';
import { FaRectangleList } from 'react-icons/fa6';
import { RiLoginBoxFill } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function Header() {
  const { user, logOut } = useUserAuth();
  const { width, toggleMenu } = useContext(HamburgerContext);
  const path = useLocation().pathname;

  const activeStyle = {
    color: '#000000',
  };

  return (
    <nav className='header'>
      {width <= 740 && path === '/projects' ? (
        <div className='nav-home nav-item'>
          <GiHamburgerMenu
            className='header-hamburger'
            onClick={(e) => toggleMenu(e)}
          />
          <NavLink
            className='logo'
            to='/'
            style={({ isActive }) => (isActive ? activeStyle : null)}
          >
            To-Do List
          </NavLink>
        </div>
      ) : (
        <NavLink
          to='/'
          style={({ isActive }) => (isActive ? activeStyle : null)}
          className='nav-home nav-item'
        >
          <TbLayoutListFilled />
          To-Do List
        </NavLink>
      )}

      <div className='nav-right'>
        <NavLink
          to='projects'
          style={({ isActive }) => (isActive ? activeStyle : null)}
          className='nav-item'
        >
          <FaRectangleList />
          Projects
        </NavLink>
        {!user ? (
          <NavLink
            to='login'
            style={({ isActive }) => (isActive ? activeStyle : null)}
            className='nav-item'
          >
            <FaUserCircle />
            Login
          </NavLink>
        ) : (
          <div className='nav-sign-out nav-item' onClick={logOut}>
            <RiLoginBoxFill />
            Sign out
          </div>
        )}
      </div>
    </nav>
  );
}