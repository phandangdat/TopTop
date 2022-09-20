import { useEffect } from 'react';

function Following() {
  useEffect(() => {
    document.title = 'Đang follow - Xem video từ những nhà sáng tạo mà bạn đang follow | TopTop';
  }, []);
  return <h2>Following page</h2>;
}

export default Following;
