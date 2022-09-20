import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';
import { Comment, Heart, HeartRed, Share } from '../Icons';
import AccountPreview from '../AccountPreview';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import httpRequest from '~/utils/httpRequest';
import { useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import ModalLogin from '~/layouts/components/ModalLogin';

const cx = classNames.bind(styles);

export default function Video({ id, data }) {
  const [followStatus, setFollowStatus] = useState(data.user.is_followed);
  const [like, setLike] = useState(data.is_liked);
  const [likeNumber, setLikeNumber] = useState(data.likes_count);
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);

  const renderPreview = (props) => {
    return (
      <div tabIndex="-1" {...props}>
        <PopperWrapper>
          <AccountPreview data={data.user} />
        </PopperWrapper>
      </div>
    );
  };
  useEffect(() => {
    setLike(data.is_liked);
    setFollowStatus(data.user.is_followed);
  }, [data.is_liked, data.user.is_followed]);
  const handleLike = async () => {
    if (!like) {
      await httpRequest
        .post(`/api/like/${id}`, null, {
          headers: { Authorization: token, withCredentials: true },
        })
        .then((res) => {
          setLike(true);
          setLikeNumber(likeNumber + 1);
        })
        .catch(() => {});
    } else {
      await httpRequest
        .delete(`/api/like/${id}`, {
          headers: { Authorization: token, withCredentials: true },
        })
        .then((res) => {
          setLike(false);
          setLikeNumber(likeNumber - 1);
        })
        .catch(() => {});
    }
  };
  const handleFollow = async () => {
    if (!followStatus) {
      await httpRequest
        .post(`/user/follow/${data.user._id}`, null, {
          headers: { Authorization: token, withCredentials: true },
        })
        .then((res) => {
          setFollowStatus(true);
        })
        .catch(() => {});
    } else {
      await httpRequest
        .delete(`/user/unfollow/${data.user._id}`, {
          headers: { Authorization: token, withCredentials: true },
        })
        .then((res) => {
          setFollowStatus(false);
        })
        .catch(() => {});
    }
  };
  return (
    <div className={cx('card')}>
      <div className={cx('break')} />
      <div className={cx('section', 'wrapper')}>
        <div className={cx('user-info')}>
          <div>
            <Tippy interactive delay={[1000, 800]} offset={[124, 0]} placement="bottom" render={renderPreview}>
              <Link to={`/@${data.nickName}`}>
                <img className={cx('user-profile')} alt="avatar" src={data.user.avatar} width={'100%'} />
              </Link>
            </Tippy>
          </div>
          <div>
            <div>
              <Tippy interactive delay={[1000, 800]} offset={[10, 27]} placement="bottom" render={renderPreview}>
                <div className={cx('section', 'wrapper-info')}>
                  <Link to={`/@${data.nickName}`} className={cx('bold')}>
                    {data.user.nickname}
                  </Link>
                  <Link to={`/@${data.nickName}`} className={cx('username')}>
                    {data.user.name}
                  </Link>
                </div>
              </Tippy>
            </div>
            <p className={cx('caption')}>{data.caption}</p>
          </div>
        </div>
        {true && (
          <button className={cx('follow-button', { 'followed-button': followStatus })} onClick={handleFollow}>
            {followStatus ? 'Đang Follow' : 'Follow'}
          </button>
        )}
      </div>
      <div className={cx('section')}>
        <video className={cx('video')} controls onDoubleClick={() => setLike(true)}>
          <source src={data.file_url} type="video/mp4" />
        </video>
        <div className={cx('section', 'socials')}>
          {auth.isLogged ? (
            <button onClick={handleLike}>
              <span className={cx('icon-social')}>{like ? <HeartRed /> : <Heart />}</span>
              <strong>{likeNumber}</strong>
            </button>
          ) : (
            <Popup
              modal
              closeOnDocumentClick={false}
              trigger={
                <button onClick={handleLike}>
                  <span className={cx('icon-social')}>{like ? <HeartRed /> : <Heart />}</span>
                  <strong>{likeNumber}</strong>
                </button>
              }
            >
              {(close) => <ModalLogin close={close} />}
            </Popup>
          )}
          <button>
            <span className={cx('icon-social')}>
              <Comment />
            </span>
            <strong>{data.comments_count}</strong>
          </button>
          <button>
            <span className={cx('icon-social')}>
              <Share />
            </span>
            <strong>{data.shareCount}</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
