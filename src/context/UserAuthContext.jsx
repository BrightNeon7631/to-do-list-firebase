import { 
  createContext, 
  useContext, 
  useEffect, 
  useState 
} from 'react';
import {
onAuthStateChanged,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

const UserAuthContext = createContext(null);

export function UserAuthContextProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  async function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logOut() {
    return signOut(auth).then(() => {
      setUser(null);
    });
  }

  return (
    <UserAuthContext.Provider value={{ user, signIn, signUp, logOut }}>
      {props.children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
