import { useEffect } from 'react';

function Message() {
  useEffect(() => {
    document.title = 'Tin nhắn | TopTop';
  }, []);
  return <h1>Message Page</h1>;
}

export default Message;
