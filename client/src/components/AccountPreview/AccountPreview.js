import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Button from '~/components/Button';
import styles from './AccountPreview.module.scss';
import Image from '~/components/Image';
const cx = classNames.bind(styles);

function AccountPreview({ data }) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <Link to={`/@${data.nickName}`} target="_blank">
          <Image className={cx('avatar')} src={data.avatar} alt="" />
        </Link>
        <Button className={cx('follow-btn')} primary>
          Follow
        </Button>
      </div>
      <div className={cx('body')}>
        <Link to={`/@${data.nickname}`} target="_blank" className={cx('nickname')}>
          <strong>{data.nickname}</strong>
          {data.tick ? <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} /> : null}
        </Link>
        <Link to={`/@${data.name}`} target="_blank" className={cx('name')}>
          {data.name}
        </Link>
        <p className={cx('analytics')}>
          <strong className={cx('value')}>{data.followers_count} </strong>
          <span className={cx('label')}>Followers</span>
          <strong className={cx('value')}>{data.likes_count} </strong>
          <span className={cx('label')}>Likes</span>
        </p>
      </div>
    </div>
  );
}

export default AccountPreview;
