import { Link } from 'react-router-dom';
import img from '../assets/images/img.jpg';

export default function Home() {
  return (
    <div className='home'>
      <div className='home-info'>
        <h2>One to-do list to rule them all.</h2>
        <div>
          Manage your projects and tasks in one app. And it's all free forever!
        </div>
      </div>
      <button>
        <Link to='projects'>Get started now!</Link>
      </button>
      <img src={img} alt='todo list' />
    </div>
  );
}
