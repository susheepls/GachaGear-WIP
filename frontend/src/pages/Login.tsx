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
          <div className='w-56 p-1 mx-auto text-one border-b-2 border-one mt-3 text-center'>
            Login
          </div>
          <LoginForm
            setLoginMessage = {setLoginMessage}
            setUsername = {setUsername}
          />
          <div className='p-1 text-center w-40 mx-auto bg-three text-four rounded-md my-2 transition hover:bg-two hover:scale-110 duration-300'>
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
          <div className='w-56 p-1 mx-auto text-one border-b-2 border-one mt-3 text-center'>
            Creating your new account!
          </div>
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