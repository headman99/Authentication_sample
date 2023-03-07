import React, { useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../css/login.css'
import { login, api, completeClientRegistration } from '../../components/api/api'
import { UserContext } from '../../App';
import secureLocalStorage from 'react-secure-storage';
import { motion } from "framer-motion"
import { FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPsw] = useState('');
  const [shakeUsername, setShakeUsername] = useState(0);
  const [shakePassword, setShakePassword] = useState(0);
  const [isVisible, setIsVisible] = useState(false)
  const [confirmPsw, setConfirmPsw] = useState('');
  const [code, setCode] = useState('')
  const usrn = useRef(null);
  const psw = useRef(null);
  const rpsw = useRef(null)
  const cd = useRef(null);

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

    if (isVisible) {

      if (!code) {
        setShakeUsername([5, -5, 0]);
        cd.current.className = 'textboxContainer error'
        return false
      }

      if (!password || password !== confirmPsw) {
        setShakePassword([5, -5, 0]);
        rpsw.current.className = 'textboxContainer error'
        return false
      }

    }
    return true

  }

  const handleSubmit = async () => {

    if (!checkInput())
      return;

    try {

      if (isVisible) {
        const state = await completeClientRegistration({
          username: username,
          password: password,
          pending: code
        });

        if (state.data.state === 1)
          alert("Registrato con successo");
      }

      const userInfo = await login({
        username: username,
        password: password
      });

      const state = userInfo?.data?.state
      if (state === 0) {
        alert('credenziali errate');
        setUsername('');
        setPsw('');
        return;
      }


      if (state === 2) {
        setIsVisible(true)
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
      if (err.response.data?.message)
        alert(err.response.data?.message)
    }


  }


  return (
    <div className='background'>
      <div className='mainContainer'>
        <div className='formContainer'>
          <div className='contentContainer'>
            {
              !isVisible ?
                <>
                  <div>
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
                        value={username}
                        placeholder='username'
                        onChange={(text) => {
                          setUsername(text.target.value)
                        }}
                        required />
                    </motion.div>
                  </div>

                  <div >
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
                        value={password}
                        onChange={(e) => {
                          setPsw(e.target.value)
                        }}
                        required
                      />
                    </motion.div>
                  </div>
                </>
                :
                <>
                  <div style={{ display: 'flex', height: 20 }} >
                    <FaArrowLeft className='click' size={30} onClick={() => {
                      setIsVisible(false)
                      setCode('')
                      setConfirmPsw('')
                    }} />
                  </div>
                  <div>
                    <label className='label'>
                      Codice Admin
                    </label>
                    <motion.div className='textboxContainer'
                      onAnimationComplete={() => setShakeUsername(0)}
                      animate={{ x: shakeUsername }}
                      transition={{ type: 'spring', duration: 0.15, repeat: 1 }}
                      ref={cd}
                    //style={shakeUsername!==0 && {borderColor:'red',boxShadow:'0 0 2px 3px #ffd9d9'}}

                    >
                      <input
                        className='username textbox'
                        type="text"
                        value={code}
                        placeholder='Codice'
                        maxLength={4}
                        onChange={(text) => {
                          setCode(text.target.value)
                        }}
                        required />
                    </motion.div>
                  </div>

                  <div >
                    <label className='label'>
                      Riconferma password
                    </label>
                    <motion.div className='textboxContainer'
                      onAnimationComplete={() => setShakePassword(0)}
                      animate={{ x: shakePassword }}
                      ref={rpsw}
                      transition={{ type: 'spring', duration: 0.15, repeat: 1 }}
                    //style={shakePassword!==0 && {borderColor:'red',boxShadow:'0 0 2px 3px #ffd9d9'}}
                    >
                      <input
                        className='password textbox'
                        placeholder='Riconferma Password'
                        type="password"
                        value={confirmPsw}
                        onChange={(e) => {
                          setConfirmPsw(e.target.value)
                        }}
                        required
                      />
                    </motion.div>
                  </div>
                </>

            }

          </div>
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 0.3 }}
          >
            <button
              className='button'
              style={{ margin: 0, width: 120, borderRadius: 10 }}
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>

        </div>
      </div>
    </div>

  )
}


export default Login