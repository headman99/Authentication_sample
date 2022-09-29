import React, { useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../css/login.css'
import { login, api } from '../../components/api/api'
import { UserContext } from '../../App';
import secureLocalStorage from 'react-secure-storage';
import { motion } from "framer-motion"

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPsw] = useState('');
  const [shakeUsername, setShakeUsername] = useState(0);
  const [shakePassword, setShakePassword] = useState(0);
  const usrn = useRef(null);
  const psw = useRef(null);
  const navigate = useNavigate();

  const checkInput = () => {
    if (!username) {
      setShakeUsername([5, -5, 0]);
      usrn.current.className = 'textboxContainer error'
      return false
    }

    if (!password) {
      setShakePassword([5, -5, 0]);
      psw.current.className = 'textboxContainer error'
      return false
    }
    return true

  }

  const handleSubmit = async () => {

    if (!checkInput())
      return;
    try {
      const userInfo = await login({
        username: username,
        password: password
      });

      if (!userInfo?.data?.state) {
        alert('credenziali errate');
        setUsername('');
        setPsw('');
        return;
      }

      const loggedUser = userInfo.data.user;
      const accessToken = userInfo.data.accessToken;
      api.defaults.headers.common['X-CSRF-TOKEN'] = userInfo.data.csrf_token;
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
      const data = {
        info: loggedUser,
        csrfToken: userInfo.data.csrf_token,
        accessToken: accessToken
      }

      setUser(data);
      secureLocalStorage.setItem('user', JSON.stringify(data));

      const route = loggedUser.isadmin ? 'admin' : 'client';
      navigate(`/${route}`, {
        replace: true
      })
    } catch (err) {
      console.log(err);
      alert('Credenziali non valide');
    }


  }


  return (
    <div className='background'>
      <div className='mainContainer'>
        <div className='formContainer'>
          <div className='contentContainer'>
            <label className='label'>
              Username
            </label>
            <motion.div className='textboxContainer'
              ref={usrn}
              onFocus={(e) => {
                psw.current.className = 'textboxContainer'
                usrn.current.className = 'textboxContainer focused';
              }}
              onBlur={(e) => {
                usrn.current.className = 'textboxContainer'
              }}

              onAnimationComplete={() => setShakeUsername(0)}
              animate={{ x: shakeUsername }}
              transition={{ type: 'spring', duration: 0.15, repeat: 1 }}

            //style={shakeUsername!==0 && {borderColor:'red',boxShadow:'0 0 2px 3px #ffd9d9'}}

            >
              <input
                className='username textbox'
                type="text"

                placeholder='username'
                onChange={(text) => {
                  setUsername(text.target.value)
                }}
                required />
            </motion.div>
          </div>

          <div className='contentContainer'>
            <label className='label'>
              Password
            </label>
            <motion.div className='textboxContainer'
              ref={psw}
              onFocus={(e) => {
                usrn.current.className = 'textboxContainer'
                psw.current.className = 'textboxContainer focused'
              }}
              onAnimationComplete={() => setShakePassword(0)}

              onBlur={(e) => {
                psw.current.className = 'textboxContainer'
              }}

              animate={{ x: shakePassword }}
              transition={{ type: 'spring', duration: 0.15, repeat: 1 }}
            //style={shakePassword!==0 && {borderColor:'red',boxShadow:'0 0 2px 3px #ffd9d9'}}
            >
              <input
                className='password textbox'
                placeholder='password'
                type="password"
                onChange={(e) => {
                  setPsw(e.target.value)
                }}
                required
              />
            </motion.div>
          </div>
              
          <button type='button'
            className='button'
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
      </div>
    </div>

  )
}


export default Login