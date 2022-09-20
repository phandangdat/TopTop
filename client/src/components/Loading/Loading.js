import classNames from 'classnames/bind';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

export default function Loading() {
  return (
    // <div className={cx('spinner-container')}>
    //   <div className={cx('loading-spinner')}></div>
    // </div>
    <section>
      <div className={cx('loader')}>
        <div className={cx('drop1')}></div>
        <div className={cx('drop2')}></div>
      </div>
    </section>
  );
}
