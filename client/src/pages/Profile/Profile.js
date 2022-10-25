// import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import Image from '~/components/Image/Image';
import Button from '~/components/Button/Button';
import { useEffect, useRef, useState } from 'react';
import * as httpRequest from '~/utils/httpRequest';
import { CheckIcon, LinkIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function Profile() {
  // const auth = useSelector((state) => state.auth);
  const { nickname } = useParams();
  const videoRef = useRef();
  const [user, setUser] = useState();
  const [videos, setVideos] = useState();

  useEffect(() => {
    document.title = `${user?.nickname} (@${user?.nickname}) | TopTop`;
  }, [user]);

  useEffect(() => {
    const fetchApi = async () => {
      httpRequest
        .get(`/user/${nickname}`)
        .then((res) => {
          setUser(res.user);
          setVideos(res.videos.data);
        })
        .catch(() => {});
    };
    fetchApi();
  }, [nickname]);
  return (
    <div className={cx('wrapper')}>
      <div className={cx('info')}>
        <div className={cx('info-thumb')}>
          <Image className={cx('avatar')} src={user?.avatar} alt="" />
          <div className={cx('info-state')}>
            <h2>
              {user?.nickname}{' '}
              {user?.tick && (
                <span>
                  <CheckIcon />
                </span>
              )}
            </h2>
            <h1>{user?.name}</h1>
            {user?.is_followed ? (
              <Button outline className={cx('btn')}>
                Messenger
              </Button>
            ) : (
              <Button primary className={cx('btn')}>
                Follow
              </Button>
            )}
          </div>
        </div>
        <div className={cx('info-famuos-count')}>
          <strong>{user?.followings_count}</strong>
          <span>Following</span>
          <strong>{user?.followers_count}</strong>
          <span>Followers</span>
          <strong>{user?.likes_count}</strong>
          <span>Likes</span>
        </div>
        <div className={cx('info-description')}>
          <p>{user?.bio}</p>
        </div>
        {user?.instagram_url ||
          user?.twitter_url ||
          (user?.youtube_url && (
            <p className={cx('info-link')}>
              <span>
                <LinkIcon />
              </span>
              {user?.instagram_url && <p>user?.instagram_url</p>}
              {user?.twitter_url && <p>user?.instagram_url</p>}
              {user?.youtube_url && <p>user?.instagram_url</p>}
            </p>
          ))}
      </div>
      <div className={cx('container')}>
        <p>Videos</p>
        <div className={cx('video-list')}>
          {videos &&
            videos.map((video) => (
              <div key={video._id} className={cx('video-box')}>
                <video loop muted ref={videoRef} preload="auto" poster={video.thumb_url} className={cx('video')}>
                  <source src={video.file_url} type="video/mp4" />
                </video>
                <span className={cx('description')}>{video.caption}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
