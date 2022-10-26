import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Upload.module.scss';
import Button from '~/components/Button';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Loading from '~/components/Loading';
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(styles);

function Upload() {
  const token = useSelector((state) => state.token);
  useEffect(() => {
    document.title = 'Tải lên | TopTop';
  }, []);

  const inputRef = useRef();
  const [source, setSource] = useState();
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [path, setPath] = useState();
  const [duration, setDuration] = useState();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setPath(file);
    setSource(url);

    const vid = document.createElement('video');
    vid.src = url;
    vid.ondurationchange = function () {
      setDuration(this.duration);
    };
  };
  const handleChoose = () => {
    inputRef.current.click();
  };
  function handleUpload() {
    let formData = new FormData();
    formData.append('file', path);
    formData.append('caption', caption);
    formData.append('duration', duration);
    setLoading(true);
    httpRequest
      .post('/api/upload_video', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: token, withCredentials: true },
      })
      .then((res) => {
        setCaption('');
        setSource(undefined);
        setLoading(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.message);
      });
  }
  return (
    <div className={cx('wrapper')}>
      {loading && (
        <div className={cx('wrap-loading')}>
          <Loading />
          {/* <span>50%</span> */}
        </div>
      )}
      <span className={cx('title-one')}>Tải video lên</span>
      <span className={cx('title-two')}>Đăng video vào tài khoản của bạn</span>
      <div className={cx('content')}>
        <div className={cx('upload-card')} onClick={handleChoose}>
          {source === undefined ? (
            <>
              <img
                src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/cloud-icon1.ecf0bf2b.svg"
                alt="upload icon"
              />
              <span>Chọn video để tải lên</span>
              <div className={cx('note-upload')}>
                <span>MP4 hoặc WebM</span>
                <span>Độ phân giải 720x1280 trở lên</span>
                <span>Tối đa 10 phút</span>
                <span>Ít hơn 2 GB</span>
              </div>
            </>
          ) : null}
          {source && <video className={cx('VideoInput_video')} controls src={source} autoPlay />}
          <input
            ref={inputRef}
            className={cx('VideoInput_input')}
            type="file"
            onChange={handleFileChange}
            accept=".mov,.mp4"
          />
          <Button primary onClick={handleChoose}>
            Chọn tập tin
          </Button>
        </div>
        <div className={cx('form-upload')}>
          <div className={cx('caption-wrap')}>
            <label>
              Caption
              <input
                type="text"
                id="caption"
                name="caption"
                placeholder="Nhập caption video..."
                autoComplete="off"
                className={cx('caption-input')}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></input>
            </label>
          </div>
          <div className={cx('button-wrap')}>
            <Button outline large>
              Hủy bỏ
            </Button>
            <Button primary large disabled={!source} onClick={handleUpload}>
              Đăng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
