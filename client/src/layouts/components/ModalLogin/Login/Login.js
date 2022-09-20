import classNames from 'classnames/bind';
import { useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { gapi } from 'gapi-script';
import { UserIcon, FacebookIcon, GoogleIcon } from '~/components/Icons';
import styles from '../ModalLogin.module.scss';
import { useDispatch } from 'react-redux';
import { dispatchLogin } from '~/redux/actions/authAction';
import { toast } from 'react-toastify';
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(styles);

gapi.load('client:auth2', () => {
  gapi.client.init({
    clientId: '370679777419-64c2ebd50oo5f9p4kc9i2o0j4be4va4q.apps.googleusercontent.com',
    plugin_name: 'Toptop',
  });
});

function Login({ setStatus }) {
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = 'Đăng nhập | TopTop';
  }, []);
  function handleStatus() {
    setStatus('loginby');
  }

  const responseGoogle = async (response) => {
    try {
      const res = await httpRequest.post(
        '/user/google_login',
        { tokenId: response.tokenId },
        { withCredentials: true },
      );
      localStorage.setItem('firstLogin', true);
      dispatch(dispatchLogin());
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const responseFacebook = async (response) => {
    try {
      const { accessToken, userID } = response;
      const res = await httpRequest.post('/user/facebook_login', { accessToken, userID }, { withCredentials: true });
      toast.success(res.data.message);
      localStorage.setItem('firstLogin', true);
      dispatch(dispatchLogin());
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  return (
    <>
      <p className={cx('header')}>Đăng nhập vào TopTop</p>
      <div className={cx('btns-login')}>
        <button className={cx('btn-login')} onClick={handleStatus}>
          <UserIcon />
          Số điện thoại / Email
        </button>
        <FacebookLogin
          appId="598427362001878"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          render={(renderProps) => (
            <button className={cx('btn-login')} onClick={renderProps.onClick}>
              <FacebookIcon />
              Tiếp tục với Facebook
            </button>
          )}
        />
        <GoogleLogin
          clientId="370679777419-64c2ebd50oo5f9p4kc9i2o0j4be4va4q.apps.googleusercontent.com"
          render={(renderProps) => (
            <button onClick={renderProps.onClick} disabled={renderProps.disabled} className={cx('btn-login')}>
              <GoogleIcon />
              Tiếp tục với Google
            </button>
          )}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </>
  );
}

export default Login;
