import { slide as Menu } from 'react-burger-menu';
import { useContext } from 'react';
import { HamburgerContext } from './Layout';

export default function ProjectsDesktopOrMobile(props) {
  const { width, menuOpenState, stateChangeHandler, closeMenu } = useContext(HamburgerContext);

  return width <= 740 ? (
    <Menu
      width={'80%'}
      customBurgerIcon={false}
      isOpen={menuOpenState}
      onStateChange={(state) => stateChangeHandler(state)}
      onClose={closeMenu}
    >
      {props.children}
    </Menu>
  ) : (
    <>{props.children}</>
  );
}