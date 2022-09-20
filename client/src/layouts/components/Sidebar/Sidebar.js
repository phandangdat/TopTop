import classNames from 'classnames/bind';
import Popup from 'reactjs-popup';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import {
  HomeIcon,
  HomeActiveIcon,
  UserGroupIcon,
  UserGroupActiveIcon,
  // LiveIcon,
  // LiveActiveIcon,
} from '~/components/Icons';
import SuggestedAccounts from '~/components/SuggestedAccounts';
import config from '~/config';
import Button from '~/components/Button';
import ModalLogin from '../ModalLogin';
import Footer from '../Footer/Footer';

const cx = classNames.bind(styles);

function Sidebar({ small }) {
  const auth = useSelector((state) => state.auth);
  const currentUser = auth.isLogged;

  return (
    <aside className={small ? cx('wrapper2') : cx('wrapper')}>
      <SimpleBar className={small ? cx('simple2') : cx('simple')}>
        <Menu>
          <MenuItem title="Dành cho bạn" to={config.routes.home} icon={<HomeIcon />} activeIcon={<HomeActiveIcon />} />
          <MenuItem
            title="Đang Follow"
            to={config.routes.following}
            icon={<UserGroupIcon />}
            activeIcon={<UserGroupActiveIcon />}
          />
          {/* <MenuItem title="LIVE" to={config.routes.live} icon={<LiveIcon />} activeIcon={<LiveActiveIcon />} /> */}
        </Menu>
        {!currentUser ? (
          <div className={cx('btn-wrapper')}>
            <p className={cx('btn-text')}>Đăng nhập để follow các tác giả, thích video và xem bình luận. </p>
            <Popup
              modal
              trigger={
                <Button outline className={cx('btn-login')}>
                  Đăng nhập
                </Button>
              }
              closeOnDocumentClick={false}
            >
              {(close) => <ModalLogin close={close} />}
            </Popup>
          </div>
        ) : null}
        <SuggestedAccounts label="Tài khoản được đề xuất" />
        {currentUser ? <SuggestedAccounts label="Các tài khoản đang follow" /> : null}
        <Footer />
      </SimpleBar>
    </aside>
  );
}

export default Sidebar;
