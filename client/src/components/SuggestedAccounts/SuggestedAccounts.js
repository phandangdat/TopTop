import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';
import httpRequest from '~/utils/httpRequest';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [showLess, setShowLess] = useState(false);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (label === 'Tài khoản được đề xuất') {
      const fetchApi = async () => {
        httpRequest
          .get('/user/random_users', {
            params: { page },
            headers: { withCredentials: true },
          })
          .then((res) => setData([...data, ...res.data]));
      };
      fetchApi();
    } else if (label === 'Các tài khoản đang follow') {
      const fetchApi = async () => {
        httpRequest
          .get('/user/users_followed', {
            params: { page },
            headers: { Authorization: token, withCredentials: true },
          })
          .then((res) => setData([...data, ...res.data]));
      };
      fetchApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleShowItems = () => {
    if (data >= 10 && showLess) {
      setPage(page + 1);
      setShowLess(false);
    } else {
      setPage(0);
      setShowLess(!showLess);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <p className={cx('label')}>{label}</p>
      {data.map((result) => (
        <AccountItem key={result._id} data={result} />
      ))}
      <p className={cx('more-btn')} onClick={handleShowItems}>
        {showLess ? 'Ẩn bớt' : 'Xem tất cả'}
      </p>
    </div>
  );
}

SuggestedAccounts.propTypes = {
  label: PropTypes.string.isRequired,
};

export default SuggestedAccounts;
