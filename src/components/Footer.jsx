import { useLocation } from 'react-router-dom';

export default function Footer() {
  const path = useLocation().pathname;

  return path !== '/projects' ? <footer>© To-Do List 2024</footer> : null;
}