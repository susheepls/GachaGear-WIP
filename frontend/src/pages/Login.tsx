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

  useEffect(() => {
    if(loginMessage === 'Internal Server Error'){
      setLoginMessage('Username already taken')
    }
  }, [loginMessage]);

  return (
    <div>
      { !isCreatingAcc ? (
        <>
          <LoginForm
            setLoginMessage = {setLoginMessage}
            setUsername = {setUsername}
          />
          <div className='p-1 text-center w-40 mx-auto bg-three text-four rounded-md my-2'>
            <button onClick={() => setIsCreatingAcc(true)}>
              Create New Account
            </button>
          </div>
          <div className='text-center'>
            {loginMessage}
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
    </div>
  )
}

export default Login