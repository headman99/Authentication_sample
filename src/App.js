import './App.css';
import Login from './screens/public/Login';
import { Route, Routes } from "react-router-dom"
import NotFound from './screens/public/NotFound';
import { createContext, useState } from 'react';
import { AdminRoutes } from './Routes/AdminRoutes';
import Loading from './screens/public/Loading';
import PrivateRoutes from './components/api/PrivateRoutes';
import { ClientRoutes } from './Routes/ClientRoutes';
import CompleteRegistration from './screens/public/CompleteRegistration';

export const UserContext = createContext();
function App() {
  const [user, setUser] = useState();
  return (
    <UserContext.Provider value={{
      user: user,
      setUser: setUser
    }}>
      <Routes>
        <Route path='/' element={<Loading />} exact />
        <Route path='/login'>
          <Route index element={<Login />} />
          <Route path='complete' element={<CompleteRegistration />} />
        </Route>
        <Route path='*' element={<NotFound />} />
        {/* percorsi privati */}
        <Route element={<PrivateRoutes admin={false} />}>
          <Route path='/client/*' element={<ClientRoutes />} />
        </Route>

        <Route element={<PrivateRoutes admin={true} />}>
          <Route path='/admin/*' element={<AdminRoutes />} />
        </Route>

      </Routes>
    </UserContext.Provider>
  );
}

export default App;
