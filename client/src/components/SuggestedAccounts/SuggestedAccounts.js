import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SuggestedAccounts.module.scss';
import AccountItem from './AccountItem';
import * as suggestedAccountsService from '~/services/suggestedAccountsService';

const cx = classNames.bind(styles);

function SuggestedAccounts({ label }) {
  const [data, setData] = useState([]);
  const [showMore, setShowMore] = useState(5);
  const [showLess, setShowLess] = useState(false);

  useEffect(() => {
    if (label === 'Tài khoản được đề xuất') {
      const fetchApi = async () => {
        const result = await suggestedAccountsService.suggestedAccounts(1, showMore);
        setData(result.data);
      };
      fetchApi();
    } else if (label === 'Following accounts') {
      setData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMore]);

  const handleShowItems = () => {
    if (showLess) {
      setShowMore(5);
      setShowLess(false);
    } else {
      setShowMore((prev) => prev + 10);
      setShowLess(true);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <p className={cx('label')}>{label}</p>
      {data.map((result) => (
        <AccountItem key={result.id} data={result} />
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
