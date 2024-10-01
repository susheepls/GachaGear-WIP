import { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  useEffect(() => {
    if(loginMessage === 'login success'){
      navigate('/');
    }
  }, [loginMessage]);

  return (
    <>
        <LoginForm
          setLoginMessage = {setLoginMessage}
        />
        <div>
          {loginMessage}
        </div>
    </>
  )
}

export default Login