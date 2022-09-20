import { useState } from 'react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import styles from '../ModalLogin.module.scss';
import { EyeCloseIcon, EyeOpenIcon } from '~/components/Icons';
import Button from '~/components/Button';
import { dispatchLogin } from '~/redux/actions/authAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(styles);

export default function LoginBy({ close }) {
  const [typeInputPassword, setTypeInputPassword] = useState('password');
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: 'all' });
  const dispatch = useDispatch();

  function handleLogin(data) {
    httpRequest
      .post(
        '/user/login',
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true },
      )
      .then((res) => {
        localStorage.setItem('firstLogin', true);
        dispatch(dispatchLogin());
        close();
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }
  return (
    <>
      <p className={cx('header')}>Đăng nhập</p>
      <form onSubmit={handleSubmit(handleLogin)} className={cx('form-login-by-gmail')}>
        <p>Email hoặc số điện thoại</p>
        <div className={cx('input-wrapper', 'mb-9')}>
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            className={cx('input', { error: errors.email })}
            autoComplete="off"
            {...register('email', {
              required: { value: true, message: 'Nhập email của bạn' },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Địa chỉ email không hợp lệ',
              },
            })}
          />
          {errors.email && (
            <div className={cx('message-wrapper')}>
              <p className={cx('validate-message')}>{errors.email.message}</p>
            </div>
          )}
        </div>
        <div className={cx('input-wrapper')}>
          <input
            {...register('password', {
              required: { value: true, message: 'Nhập password của bạn' },
              minLength: {
                value: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự',
              },
            })}
            type={typeInputPassword}
            placeholder="Mật khẩu"
            className={cx('input', { error: errors.password })}
            autoComplete="off"
          />
          {typeInputPassword === 'password' ? (
            <i className={cx('password-icon')} onClick={() => setTypeInputPassword('text')}>
              <EyeCloseIcon />
            </i>
          ) : null}
          {typeInputPassword === 'text' ? (
            <i className={cx('password-icon')} onClick={() => setTypeInputPassword('password')}>
              <EyeOpenIcon />
            </i>
          ) : null}
          {errors.password && (
            <div className={cx('message-wrapper')}>
              <p className={cx('validate-message')}>{errors.password.message}</p>
            </div>
          )}
        </div>
        <Button onlyText to="/" className={cx('forgot-btn')}>
          Quên mật khẩu?
        </Button>
        <div>
          <Button primary disabled={!getValues('email') || !getValues('password')}>
            Đăng nhập
          </Button>
        </div>
      </form>
    </>
  );
}
