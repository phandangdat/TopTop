import Tippy from '@tippyjs/react/headless';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import { SmallHeartIcon, SmallHeartRedIcon } from '../Icons';
import AccountPreview from '../AccountPreview';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Button from '../Button';

const cx = classNames.bind(styles);

export default function Comment({ data, result, setSubComment }) {
  const [likeComment, setLikeComment] = useState(false);
  const renderPreview = (props) => {
    return (
      <div tabIndex="-1" {...props}>
        <PopperWrapper>
          <AccountPreview data={result.commenter} />
        </PopperWrapper>
      </div>
    );
  };
  return (
    <div className={cx('comment', 'section')}>
      <div className={cx('user-info')}>
        <div>
          <Tippy interactive delay={[1000, 800]} offset={[124, 0]} placement="bottom" render={renderPreview}>
            <Link to={`/@${result.commenter.nickname}`}>
              <img className={cx('user-profile')} alt="avatar" src={result.commenter.avatar} width={'100%'} />
            </Link>
          </Tippy>
        </div>
        <div>
          <div>
            <Tippy interactive delay={[1000, 800]} offset={[10, 27]} placement="bottom" render={renderPreview}>
              <div className={cx('section', 'wrapper-info')}>
                <Link to={`/@${result.commenter.nickname}`} className={cx('bold')}>
                  {result.commenter.name}
                </Link>
                <p className={cx('text-comment')}>{result.content}</p>
              </div>
            </Tippy>
          </div>
          <div className={cx('answer-comment')}>
            <p className={cx('time-comment')}>11 giờ trước</p>
            {/* <p
              className={cx('rep-comment')}
              onClick={() => setSubComment({ boolean: true, idCmt: result._id, userCmt: result.commenter.name })}
            >
              Trả lời
            </p> */}
          </div>
          {/* <div className={cx('user-info')}>
            <div>
              <Tippy interactive delay={[1000, 800]} offset={[124, 0]} placement="bottom" render={renderPreview}>
                <Link to={`/@${result.commenter.nickname}`}>
                  <img
                    className={cx('user-profile', 'avatar-small')}
                    alt="avatar"
                    src={result.commenter.avatar}
                    width={'100%'}
                  />
                </Link>
              </Tippy>
            </div>
            <div>
              <div>
                <Tippy interactive delay={[1000, 800]} offset={[10, 27]} placement="bottom" render={renderPreview}>
                  <div className={cx('section', 'wrapper-info')}>
                    <Link to={`/@${result.commenter.nickname}`} className={cx('bold')}>
                      {result.commenter.name}
                    </Link>
                    <p className={cx('text-comment')}>{result.content}</p>
                  </div>
                </Tippy>
              </div>
              <div className={cx('answer-comment')}>
                <p className={cx('time-comment')}>11 giờ trước</p>
                <p
                  className={cx('rep-comment')}
                  onClick={() => setSubComment({ boolean: true, idCmt: result._id, userCmt: result.commenter.name })}
                >
                  Trả lời
                </p>
              </div>
            </div>
          </div> */}
          {/* <Button onlyText className={cx('button-view-more')}>
            Xem thêm câu trả lời khác (4)
          </Button> */}
        </div>
      </div>
      <button onClick={() => setLikeComment(!likeComment)} className={cx('like-comment')}>
        <span>{likeComment ? <SmallHeartRedIcon /> : <SmallHeartIcon />}</span>
        <span>{data.comments_count}</span>
      </button>
    </div>
  );
}
