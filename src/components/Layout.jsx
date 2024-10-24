import { 
  createContext, 
  useState,
  useEffect
} from 'react';
import { 
  Outlet, 
  useLocation 
} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import useWindowDimensions from './WindowDimensions';
import { UserAuthContextProvider } from '../context/UserAuthContext';

export const HamburgerContext = createContext(null);

export default function Layout() {
  const [menuOpenState, setMenuOpenState] = useState(false);
  const { width } = useWindowDimensions();
  const path = useLocation().pathname;

  // resets open menu state when user navigates to a different page
  useEffect(() => {
    if (path !== '/projects') {
      setMenuOpenState(false);
    }
  }, [path]);

  return (
    <div className='site-layout'>
      <UserAuthContextProvider>
        <HamburgerContext.Provider
          value={{
            width,
            menuOpenState,
            toggleMenu: () => setMenuOpenState(!menuOpenState),
            stateChangeHandler: (newState) => setMenuOpenState(newState.isOpen),
            closeMenu: () => setMenuOpenState(false),
          }}
        >
          <Header />
          <Outlet />
        </HamburgerContext.Provider>
        <Footer />
      </UserAuthContextProvider>
    </div>
  );
}
