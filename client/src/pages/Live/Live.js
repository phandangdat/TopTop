import { useEffect } from 'react';

function Live() {
  useEffect(() => {
    document.title = 'TopTop LIVE | TopTop';
  }, []);
  return <h1>Live Page</h1>;
}

export default Live;
