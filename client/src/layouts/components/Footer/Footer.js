import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <footer className={cx('wrapper')}>
      <div className={cx('title')}>
        <a href="/">About</a>
        <a href="/"> Toptop</a> <a href="/">Browse</a> <a href="/">Newsroom</a> <a href="/">Contact</a>{' '}
        <a href="/">Careers</a> <a href="/">Byte</a> <a href="/">Dance</a>
      </div>
      <div className={cx('title')}>
        <a href="/">Toptop for Good</a>
        <a href="/">Advertise</a>
        <a href="/">Developers</a>
        <a href="/">Transparency</a>
        <a href="/">Toptop</a>
        <a href="/">Rewards</a>
      </div>
      <div className={cx('title')}>
        <a href="/">Help</a> <a href="/">Safety</a> <a href="/">Terms</a> <a href="/">Privacy</a>{' '}
        <a href="/">Creator</a> <a href="/">Portal</a> <a href="/">Community</a> <a href="/">Guidelines</a>
      </div>
      <a href="/">© 2022 Toptop</a>
    </footer>
  );
};

export default Footer;
