import './App.css';
import './screens/public/login/Login'
import Login from './screens/public/login/Login';
import { Route, Routes } from "react-router-dom"
import NotFound from './screens/public/NotFound/NotFound';
import Home from './screens/Client/Home/Home';
import { createContext, useState } from 'react';
import { AdminRoutes } from './Routes/AdminRoutes';
import Loading from './screens/public/Loading/Loading';

export const UserContext = createContext();
function App() {
  const [user, setUser] = useState();

  return (
    <UserContext.Provider value={{
      user:user,
      setUser:setUser
    }}>
      <Routes>
        <Route path='/' element={<Loading />} />
        <Route path='/login' element={<Login />} />

        <Route path='/client'>
          <Route path='home' element={<Home />} />
        </Route>
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </UserContext.Provider>

    /*<div className="App">
      <header className="App-header">
        <Login></Login>
      </header>
    </div>*/
  );
}

export default App;
