import { useState } from 'react';
import Auth from '../components/Auth.jsx';
import Admin from '../components/Admin.jsx';
import User from '../components/User.jsx';
import { getToken, clearToken, getUserInfo } from '../utils/Auth.js';

function App() {
    const [token, setToken] = useState(getToken());
    const [userInfo, setUserInfo] = useState(getUserInfo());

    const handleAuthenticated = (newToken, userInfo) => {
        setToken(newToken);
        setUserInfo(userInfo);
    };

    const handleLogout = () => {
        clearToken();
        setToken(null);
        setUserInfo(null);
    };

    if (!token) return <Auth onAuthenticated={handleAuthenticated} />;
    if (userInfo && userInfo.role === 'a') return <Admin onLogout={handleLogout} />;
    return <User onLogout={handleLogout} />;
}

export default App;