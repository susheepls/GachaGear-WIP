import { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if(loginMessage === 'login success'){
      navigate('/', { state: { username : username}});
    }
  }, [loginMessage]);

  return (
    <>
        <LoginForm
          setLoginMessage = {setLoginMessage}
          setUsername = {setUsername}
        />
        <div>
          {loginMessage}
        </div>
    </>
  )
}

export default Login