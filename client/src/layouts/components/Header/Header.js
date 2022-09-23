import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpFromBracket,
  faCircleQuestion,
  faCoins,
  faEarthAsia,
  faEllipsisVertical,
  faGear,
  faKeyboard,
  faSignOut,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSelector } from 'react-redux';
import config from '~/config';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Menu from '~/components/Popper/Menu';
import { InboxIcon, MessageIcon, UploadIcon } from '~/components/Icons';
import Image from '~/components/Image';
import Search from '../Search';
import PopupLogin from '~/components/PopupLogin';

const cx = classNames.bind(styles);

const MENU_ITEMS = [
  {
    icon: <FontAwesomeIcon icon={faEarthAsia} />,
    title: 'English',
    children: {
      title: 'Language',
      data: [
        {
          type: 'language',
          code: 'en',
          title: 'English',
        },
        {
          type: 'language',
          code: 'vi',
          title: 'Tiếng Việt',
        },
      ],
    },
  },
  {
    icon: <FontAwesomeIcon icon={faCircleQuestion} />,
    title: 'Feedback and help',
    to: '/feedback',
  },
  {
    icon: <FontAwesomeIcon icon={faKeyboard} />,
    title: 'Keyboard shortcuts',
  },
];

function Header({ small = true }) {
  const auth = useSelector((state) => state.auth);
  const currentUser = auth.isLogged;
  // Handle logic
  const handleMenuChange = (menuItem) => {
    switch (menuItem.type) {
      case 'language':
        // Handle change language
        break;
      default:
    }
  };

  const userMenu = [
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      title: 'View profile',
      to: `/@${auth.user.nickname}`,
    },
    {
      icon: <FontAwesomeIcon icon={faCoins} />,
      title: 'Get coins',
      to: '/coin',
    },
    {
      icon: <FontAwesomeIcon icon={faGear} />,
      title: 'Settings',
      to: '/settings',
    },
    ...MENU_ITEMS,
    {
      icon: <FontAwesomeIcon icon={faSignOut} />,
      title: 'Log out',
      to: '/logout',
      separate: true,
    },
  ];
  return (
    <header className={cx('wrapper')}>
      <div className={small ? cx('inner') : cx('inner2')}>
        <Link to={config.routes.home} className={cx('logo-link')}>
          <img src={images.logo} alt="TopTop" />
        </Link>

        <Search />

        <div className={cx('actions')}>
          {currentUser ? (
            <>
              <Tippy delay={[0, 50]} content="Upload video" placement="bottom">
                <Link to={'/upload'} className={cx('action-btn')}>
                  <UploadIcon />
                </Link>
              </Tippy>
              <Tippy delay={[0, 50]} content="Message" placement="bottom">
                <Link to={'/messages'} className={cx('action-btn')}>
                  <MessageIcon />
                </Link>
              </Tippy>
              <Tippy delay={[0, 50]} content="Notification" placement="bottom">
                <button className={cx('action-btn')}>
                  <InboxIcon />
                  <span className={cx('badge')}>12</span>
                </button>
              </Tippy>
              <Menu items={userMenu} onChange={handleMenuChange}>
                <Image className={cx('user-avatar')} src={auth.user.avatar} alt={auth.user.avatar} />
              </Menu>
            </>
          ) : (
            <>
              <PopupLogin
                children={
                  <Button outline>
                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                    <span> Tải lên</span>
                  </Button>
                }
              />
              <PopupLogin children={<Button primary>Đăng nhập</Button>} />
              <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
                <button className={cx('more-btn')}>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
              </Menu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
