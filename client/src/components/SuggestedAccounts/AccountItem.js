import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '../AccountPreview';
import styles from './SuggestedAccounts.module.scss';
import Image from '../Image';

const cx = classNames.bind(styles);

function AccountItem({ data, label }) {
  const renderPreview = (props) => {
    return (
      <div tabIndex="-1" {...props}>
        <PopperWrapper>
          <AccountPreview data={data} />
        </PopperWrapper>
      </div>
    );
  };

  return (
    <div>
      {label === 'Tài khoản được đề xuất' ? (
        <Tippy interactive delay={[800, 0]} offset={[-20, 0]} placement="bottom" render={renderPreview}>
          <Link to={`/@${data.nickname}`} className={cx('account-item')}>
            <Image className={cx('avatar')} src={data.avatar} alt="" />
            <div className={cx('item-info')}>
              <p className={cx('nickname')}>
                <strong>{data.nickname}</strong>
                {data.tick ? <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} /> : null}
              </p>
              <p className={cx('name')}>{data.name}</p>
            </div>
          </Link>
        </Tippy>
      ) : (
        <Link to={`/@${data.nickname}`} className={cx('account-item')}>
          <Image className={cx('avatar')} src={data.avatar} alt="" />
          <div className={cx('item-info')}>
            <p className={cx('nickname')}>
              <strong>{data.nickname}</strong>
              {data.tick ? <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} /> : null}
            </p>
            <p className={cx('name')}>{data.name}</p>
          </div>
        </Link>
      )}
    </div>
  );
}

AccountItem.propTypes = {};

export default AccountItem;
