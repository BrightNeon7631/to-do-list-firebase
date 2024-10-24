import { 
    useEffect, 
    useState 
} from 'react';
import { 
    useNavigate, 
    useLocation 
} from 'react-router-dom';
import { 
    MdEmail, 
    MdKey 
} from 'react-icons/md';
import { useUserAuth } from '../context/UserAuthContext';

export default function Login() {
  const location = useLocation().state;
  const navigate = useNavigate();

  const { signIn, signUp, user } = useUserAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [login, setLogin] = useState(true);
  const [formStatus, setFormStatus] = useState('idle');
  const [error, setError] = useState(location || null);

  useEffect(() => {
    if (user) {
      navigate('/projects', { replace: true });
    }
  }, [user]);

  function handleChange(e) {
    const { value, name } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  function validateForm() {
    const emailRegEx = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (
      formData.email.length < 1 ||
      formData.email.includes(' ') ||
      emailRegEx.test(formData.email) === false
    ) {
      return { message: 'Incorrect email value.' };
    } else if (
      formData.password.length < 6 ||
      formData.password.length > 40 ||
      formData.password.includes(' ')
    ) {
      return { message: 'Incorrect password value.' };
    }
  }

  async function handleForm(e) {
    e.preventDefault();
    const formValidation = validateForm();
    if (formValidation) {
      setError(formValidation);
      return;
    }

    try {
      setError(null);
      setFormStatus('submitting');
      if (login) {
        await signIn(formData.email, formData.password);
      } else if (!login && formData.password === formData.repeatPassword) {
        await signUp(formData.email, formData.password);
      } else {
        setError({ message: `Passwords don't match` });
      }
    } catch (err) {
      setError(err);
    } finally {
      setFormStatus('idle');
    }
  }

  return (
    <div className='login-container'>
      {error ? (
        <div className='error'>{error?.message || 'Unexpected error'}</div>
      ) : null}
      <form className='login' onSubmit={(e) => handleForm(e)}>
        <div className='login-input-item'>
          <label>Email address</label>
          <div className='login-input'>
            <MdEmail />
            <input
              type='email'
              name='email'
              placeholder='Enter your email address'
              required
              value={formData.email}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className='login-input-item'>
          <label>Password</label>
          <div className='login-input'>
            <MdKey />
            <input
              type='password'
              name='password'
              placeholder='Enter password'
              required
              minLength={6}
              maxLength={40}
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        {!login ? (
          <div className='login-input-item'>
            <label>Repeat password</label>
            <div className='login-input'>
              <MdKey />
              <input
                type='password'
                name='repeatPassword'
                placeholder='Confirm password'
                required
                minLength={6}
                maxLength={40}
                value={formData.repeatPassword}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
        ) : null}
        <button disabled={formStatus === 'submitting'}>
          {login ? 'Login' : 'Sign up'}
        </button>
      </form>
      <p onClick={() => setLogin((prevState) => !prevState)}>
        {login
          ? <>Don't have an account? <span>Register now!</span></>
          : <>Already have an account? <span>Login now!</span></>}
      </p>
    </div>
  );
}