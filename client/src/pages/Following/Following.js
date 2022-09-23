import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import httpRequest from '~/utils/httpRequest';
import Video from '~/components/Video';

function Following() {
  const [page, setPage] = useState(0);
  const [videos, setVideos] = useState([]);
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    document.title = 'TopTop - Make Your Day';
  }, []);

  useEffect(() => {}, [page, auth.isLogged]);
  function loadPage() {
    if (videos.length >= 10) {
      setPage(page + 1);
    } else {
      setPage(0);
    }
  }
  return (
    <>
      {auth.isLogged ? (
        <InfiniteScroll dataLength={videos.length} next={loadPage} hasMore={true}>
          <div>{videos && videos.map((result) => <Video key={result._id} data={result} />)}</div>
        </InfiniteScroll>
      ) : null}
    </>
  );
}

export default Following;
