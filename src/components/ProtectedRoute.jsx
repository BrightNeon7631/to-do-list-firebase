import { useUserAuth } from '../context/UserAuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute(props) {
    const { user } = useUserAuth();

    return user ? props.children : <Navigate to='/login' state={{ message: 'You must login first!' }} />
}