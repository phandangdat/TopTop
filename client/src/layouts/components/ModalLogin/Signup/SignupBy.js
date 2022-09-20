import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import styles from '../ModalLogin.module.scss';
import { EyeCloseIcon, EyeOpenIcon } from '~/components/Icons';
import Button from '~/components/Button';
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(styles);

export default function SignupBy() {
  const [typeInputPassword, setTypeInputPassword] = useState('password');
  const [checked, setChecked] = useState(false);
  const currentYear = new Date().getFullYear();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    mode: 'all',
    defaultValues: { dateOfBirth: '', monthOfBirth: '', yearOfBirth: '' },
  });

  function calculateYear(start, stop, step) {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
  }

  function handleRegister(data) {
    httpRequest
      .post('/user/register', {
        dateOfBirth: data.dateOfBirth,
        monthOfBirth: data.monthOfBirth,
        yearOfBirth: data.yearOfBirth,
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        toast.success(res.data.message);
        reset();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  return (
    <>
      <p className={cx('header')}>Đăng ký</p>
      <form className={cx('form-register-by-gmail')} onSubmit={handleSubmit(handleRegister)}>
        <p>Ngày sinh của bạn là ngày nào?</p>
        <div
          className={cx('select-wrapper', {
            'mb-9': !errors.monthOfBirth && !errors.dateOfBirth && !errors.yearOfBirth,
          })}
        >
          <select {...register('yearOfBirth', { required: 'Bạn phải chọn ngày, tháng, năm sinh' })}>
            <option value="" disabled hidden>
              Năm
            </option>
            {calculateYear(currentYear, currentYear - 50, -1).map((year, index) => (
              <option key={index + 1} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select {...register('monthOfBirth', { required: 'Bạn phải chọn ngày, tháng, năm sinh' })}>
            <option value="" disabled hidden>
              Tháng
            </option>
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                Tháng {index + 1}
              </option>
            ))}
          </select>
          <select {...register('dateOfBirth', { required: 'Bạn phải chọn ngày, tháng, năm sinh' })}>
            <option value="" disabled hidden>
              Ngày
            </option>
            {[...Array(new Date(getValues('yearOfBirth'), getValues('monthOfBirth'), 0).getDate())].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
        <div className={cx('message-wrapper', 'mb-9')}>
          {(errors.dateOfBirth && <p className={cx('validate-message')}>{errors.dateOfBirth.message}</p>) ||
            (errors.monthOfBirth && <p className={cx('validate-message')}>{errors.monthOfBirth.message}</p>) ||
            (errors.yearOfBirth && <p className={cx('validate-message')}>{errors.yearOfBirth.message}</p>)}
        </div>
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
              maxLength: {
                value: 50,
                message: 'Email không được vượt quá 50 kí tự',
              },
            })}
          />
          {errors.email && (
            <div className={cx('message-wrapper')}>
              <p className={cx('validate-message')}>{errors.email.message}</p>
            </div>
          )}
        </div>
        <div className={cx('input-wrapper', 'mb-9')}>
          <input
            type={typeInputPassword}
            placeholder="Mật khẩu"
            className={cx('input', { error: errors.email })}
            autoComplete="off"
            {...register('password', {
              required: { value: true, message: 'Nhập password của bạn' },
              minLength: {
                value: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự',
              },
              maxLength: {
                value: 20,
                message: 'Mật khẩu không được vượt quá 20 kí tự',
              },
            })}
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
        <div className={cx('verify-wrapper')}>
          <div className={cx('checkbox-wrapper')}>
            <input
              type="checkbox"
              className={cx('checkbox')}
              {...register('check', {
                required: true,
              })}
              onChange={() => setChecked((current) => !current)}
              onClick={() => setValue('check', !checked)}
            />
          </div>
          <p>
            Nhận nội dung thịnh hành, bản tin, khuyến mại, đề xuất và thông tin cập nhật tài khoản được gửi đến email
            của bạn
          </p>
        </div>
        <div>
          <Button primary disabled={!getValues('email') || !getValues('password') || !getValues('check')}>
            Tiếp
          </Button>
        </div>
      </form>
    </>
  );
}
