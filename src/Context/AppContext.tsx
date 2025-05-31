import React, { ReactNode } from 'react';
import { AppContextProps } from '../Model/root.model';
import { useNavigate } from 'react-router-dom';
import { LogoutService } from './Service/AppContext.service';

export const AppContextAPI = React.createContext<AppContextProps>({
  login: false,
  setLogin: () => {},
  spin: false,
  setSpin: () => {},
  Logout: 1,
  activeAddUserModal: false,
  setAActiveAddUserModal: () => {},
});
const AppContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [login, setLogin] = React.useState(false);
  const [activeAddUserModal, setAActiveAddUserModal] = React.useState(false);
  const [spin, setSpin] = React.useState(false);
  const navigate = useNavigate();
  const Logout = async (): Promise<void> => {
    await LogoutService();
    navigate('/');
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
    localStorage.clear();
    window.location.reload();
  };
  React.useEffect(() => {
    setSpin(true);
    const interval = setTimeout(() => {
      setSpin(false);
    }, 1000);
    return () => clearTimeout(interval);
  }, [navigate]);
  const contextValue: AppContextProps = {
    login,
    setLogin, // Thêm setActiveModalLogin vào context
    spin,
    setSpin,
    Logout,
    activeAddUserModal,
    setAActiveAddUserModal,
  };
  return (
    <AppContextAPI.Provider value={contextValue}>
      {children}
    </AppContextAPI.Provider>
  );
};

export default AppContext;
