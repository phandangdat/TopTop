import React from 'react';
import classNames from 'classnames/bind';
import styles from './NotFound.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

export default function NotFound() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('mars')}></div>
      <img alt="404" src="https://assets.codepen.io/1538474/404.svg" className={cx('logo-404')} />
      <img alt="404" src="https://assets.codepen.io/1538474/meteor.svg" className={cx('meteor')} />
      <p className={cx('title')}>Oh no!!</p>
      <p className={cx('subtitle')}>
        You’re either misspelling the URL <br /> or requesting a page that's no longer here.
      </p>
      <div align="center">
        <Link to={'/'} className={cx('btn-back')}>
          Về trang chủ
        </Link>
      </div>
      <img alt="404" src="https://assets.codepen.io/1538474/astronaut.svg" className={cx('astronaut')} />
      <img alt="404" src="https://assets.codepen.io/1538474/spaceship.svg" className={cx('spaceship')} />
    </div>
  );
}
