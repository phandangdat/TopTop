import classNames from 'classnames/bind';
import { useState } from 'react';
import Button from '~/components/Button';
import Login from './Login/Login';
import LoginBy from './Login/LoginBy';
import Signup from './Signup/Signup';
import SignupBy from './Signup/SignupBy';
import styles from './ModalLogin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ModalLogin({ close }) {
  const [status, setStatus] = useState('login');
  return (
    <div className={cx('modal')}>
      <header>
        {status === 'loginby' ? (
          <Button className={cx('back')} onClick={() => setStatus('login')}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>
        ) : status === 'signupby' ? (
          <Button className={cx('back')} onClick={() => setStatus('signup')}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>
        ) : null}
        <button className={cx('close')} onClick={close}>
          &times;
        </button>
      </header>

      {status === 'login' ? (
        <Login setStatus={setStatus} />
      ) : status === 'loginby' ? (
        <LoginBy close={close} />
      ) : status === 'signup' ? (
        <Signup setStatus={setStatus} />
      ) : status === 'signupby' ? (
        <SignupBy />
      ) : null}

      <footer className={cx('footer')}>
        {status === 'login' || status === 'loginby' ? (
          <>
            <div>Bạn không có tài khoản?</div>
            <Button onlyText onClick={() => setStatus('signup')}>
              Đăng ký
            </Button>
          </>
        ) : (
          <>
            <div>Bạn đã có tài khoản?</div>
            <Button onlyText onClick={() => setStatus('login')}>
              Đăng nhập
            </Button>
          </>
        )}
      </footer>
    </div>
  );
}

export default ModalLogin;
