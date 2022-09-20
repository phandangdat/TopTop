import { useEffect } from 'react';
import { toast } from 'react-toastify';
import httpRequest from '~/utils/httpRequest';
import Home from '../Home';

function Logout() {
  useEffect(() => {
    document.title = 'Đang follow - Xem video từ những nhà sáng tạo mà bạn đang follow | TopTop';
  }, []);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await httpRequest.get('/user/logout');
        localStorage.removeItem('firstLogin');
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (err) {
        toast.error(err.response.data.message);
      }
    };
    handleLogout();
  }, []);
  return <Home />;
}

export default Logout;
