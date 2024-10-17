import { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom';
import CreateNewAccForm from '../components/CreateNewAccForm';

const Login = () => {
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  //if user is creating acc display different component
  const [isCreatingAcc, setIsCreatingAcc] = useState<boolean>(false);

  useEffect(() => {
    if(loginMessage === 'login success'){
      navigate('/', { state: { username : username}});
    }
  }, [loginMessage]);

  return (
    <>
      { !isCreatingAcc ? (
        <>
          <LoginForm
            setLoginMessage = {setLoginMessage}
            setUsername = {setUsername}
          />
          <div>
            {loginMessage}
          </div>
          <div>
            <button onClick={() => setIsCreatingAcc(true)}>
              Create New Account
            </button>
          </div>
        </>
       ) : (
        <>
          <CreateNewAccForm
            setIsCreatingAcc = {setIsCreatingAcc}
            setLoginMessage = {setLoginMessage}
          />
        </>
       )}
    </>
  )
}

export default Login