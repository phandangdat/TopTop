import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as httpRequest from '~/utils/httpRequest';
import AccountPreview from '../AccountPreview';
import PopupLogin from '../PopupLogin';
import styles from './DetailVideo.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { CommentIcon, Heart, HeartRed } from '../Icons';
import Comment from '../Comment';
import Button from '../Button';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

export default function DetailVideo({ close, data }) {
  const videoRef = useRef();
  const [followStatus, setFollowStatus] = useState(data.user.is_followed);
  const { register, handleSubmit, watch, reset } = useForm({ mode: 'all', defaultValues: { comment: '' } });
  const [like, setLike] = useState(data.is_liked);
  const [likeNumber, setLikeNumber] = useState(data.likes_count);
  const [commentNumber, setCommentNummber] = useState(data.comments_count);
  const [comments, setComments] = useState([]);
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const [subComment, setSubComment] = useState({});
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
  }, [data]);

  const handleLike = async () => {
    if (!like) {
      await httpRequest
        .post(
          `/api/like/${data._id}`,
          {
            userIdVideo: data.user._id,
          },
          {
            headers: { Authorization: token, withCredentials: true },
          },
        )
        .then((res) => {
          setLike(true);
          setLikeNumber(likeNumber + 1);
        })
        .catch(() => {});
    } else {
      await httpRequest
        .deleteReq(`http://localhost:5000/api/like/${data._id}`, {
          headers: { Authorization: token, withCredentials: true },
          data: {
            userIdVideo: data.user._id,
          },
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
        .deleteReq(`/user/unfollow/${data.user._id}`, {
          headers: { Authorization: token, withCredentials: true },
        })
        .then((res) => {
          setFollowStatus(false);
        })
        .catch(() => {});
    }
  };
  const getComments = async () => {
    await httpRequest
      .get(`api/comments/video/${data._id}`, {
        headers: { Authorization: token, withCredentials: true },
      })
      .then((res) => {
        setComments(res);
        setSubComment(false);
      })
      .catch(() => {});
  };
  const handleComment = async () => {
    if (subComment.boolean) {
      await httpRequest
        .post(
          `/api/comments/${data._id}`,
          {
            content: watch('comment'),
            parentId: subComment.idCmt,
          },
          {
            headers: { Authorization: token, withCredentials: true },
          },
        )
        .then((res) => {
          reset();
          getComments();
          setCommentNummber(commentNumber + 1);
          setComments([comments, ...res]);
        })
        .catch((err) => {
          toast.error(err.message.error);
        });
    } else {
      await httpRequest
        .post(
          `/api/comments/${data._id}`,
          {
            content: watch('comment'),
          },
          {
            headers: { Authorization: token, withCredentials: true },
          },
        )
        .then((res) => {
          reset();
          getComments();
          setCommentNummber(commentNumber + 1);
          setComments([comments, ...res]);
        })
        .catch((err) => {
          toast.error(err.message.error);
        });
    }
  };
  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={cx('wrapper')}>
      <div className={cx('video-container')}>
        <button className={cx('close')} onClick={close}>
          &times;
        </button>
        <video loop autoPlay muted ref={videoRef} controls preload="auto" className={cx('video')}>
          <source src={data.file_url} type="video/mp4" />
        </video>
      </div>
      <div className={cx('content-container')}>
        <div className={cx('section', 'wrap')}>
          <div className={cx('user-info')}>
            <div>
              <Tippy interactive delay={[1000, 800]} offset={[124, 0]} placement="bottom" render={renderPreview}>
                <Link to={`/@${data.user.nickname}`}>
                  <img className={cx('user-profile')} alt="avatar" src={data.user.avatar} width={'100%'} />
                </Link>
              </Tippy>
            </div>
            <div>
              <div>
                <Tippy interactive delay={[1000, 800]} offset={[25, 5]} placement="bottom" render={renderPreview}>
                  <div className={cx('section', 'wrapper-info')}>
                    <Link to={`/@${data.user.nickname}`} className={cx('bold')}>
                      {data.user.nickname}
                    </Link>
                    <Link to={`/@${data.user.nickname}`} className={cx('username')}>
                      {data.user.name}
                    </Link>
                  </div>
                </Tippy>
              </div>
            </div>
          </div>
          {auth.isLogged ? (
            <button className={cx('follow-button', { 'followed-button': followStatus })} onClick={handleFollow}>
              {followStatus ? 'Đang Follow' : 'Follow'}
            </button>
          ) : (
            <PopupLogin
              children={
                <button className={cx('follow-button', { 'followed-button': followStatus })} onClick={handleFollow}>
                  {followStatus ? 'Đang Follow' : 'Follow'}
                </button>
              }
            />
          )}
        </div>
        <p className={cx('caption')}>{data.caption}</p>
        <div className={cx('section', 'socials')}>
          {auth.isLogged ? (
            <button onClick={handleLike}>
              <span className={cx('icon-social')}>{like ? <HeartRed /> : <Heart />}</span>
              <strong>{likeNumber}</strong>
            </button>
          ) : (
            <PopupLogin
              children={
                <button onClick={handleLike}>
                  <span className={cx('icon-social')}>{like ? <HeartRed /> : <Heart />}</span>
                  <strong>{likeNumber}</strong>
                </button>
              }
            />
          )}
          <button>
            <span className={cx('icon-social')}>
              <CommentIcon />
            </span>
            <strong>{commentNumber}</strong>
          </button>
        </div>
        <div className={cx('comment-area')}>
          <SimpleBar className={cx('simple')}>
            {comments &&
              comments.map((result) => (
                <Comment key={result._id} data={data} result={result} setSubComment={setSubComment} />
              ))}
          </SimpleBar>
        </div>
        <form className={cx('input-container')} onSubmit={handleSubmit(handleComment)}>
          {subComment ? (
            <input
              {...register('comment', {
                maxLength: {
                  value: 150,
                },
              })}
              maxLength="150"
              placeholder={`Trả lời @${subComment.userCmt}`}
              className={cx('input')}
              autoComplete="off"
              size="50"
            />
          ) : (
            <input
              {...register('comment', {
                maxLength: {
                  value: 150,
                },
              })}
              maxLength="150"
              placeholder="Thêm bình luận..."
              className={cx('input')}
              autoComplete="off"
              size="50"
            />
          )}
          <Button text disabled={!watch('comment')}>
            Đăng
          </Button>
        </form>
      </div>
    </div>
  );
}
