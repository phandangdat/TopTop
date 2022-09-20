import classNames from 'classnames/bind';
import styles from './FullView.module.scss';
import Sidebar from '~/layouts/components/Sidebar';
import Header from '~/layouts/components/Header';

const cx = classNames.bind(styles);

const FullView = ({ children }) => {
  return (
    <div className={cx('wrapper')}>
      <Header small={false} />
      <div className={cx('container')}>
        <Sidebar small />
        <div className={cx('content')}>{children}</div>
      </div>
    </div>
  );
};

export default FullView;
