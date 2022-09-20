import classNames from 'classnames/bind';
import { useEffect } from 'react';

import { UserIcon, FacebookIcon, GoogleIcon } from '~/components/Icons';
import Button from '~/components/Button';
import styles from '../ModalLogin.module.scss';

const cx = classNames.bind(styles);

function Signup({ setStatus }) {
  useEffect(() => {
    document.title = 'Đăng ký | TopTop';
  }, []);

  function handleStatus() {
    setStatus('signupby');
  }
  return (
    <>
      <p className={cx('header')}>Đăng ký TopTop</p>
      <div className={cx('btns-login')}>
        <button className={cx('btn-login')} onClick={handleStatus}>
          <UserIcon />
          Sử dụng số điện thoại hoặc email
        </button>
        <button className={cx('btn-login')}>
          <FacebookIcon />
          Tiếp tục với Facebook
        </button>
        <button className={cx('btn-login')}>
          <GoogleIcon />
          Tiếp tục với Google
        </button>
      </div>
      <p className={cx('pragraph-policy')}>
        Bằng cách tiếp tục, bạn đồng ý với <Button to={'/'}>Điều khoản Sử dụng</Button> của TopTop và xác nhận rằng bạn
        đã đọc hiểu <Button to={'/'}>Chính sách Quyền riêng tư</Button> của TopTop.
      </p>
    </>
  );
}

export default Signup;
