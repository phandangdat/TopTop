import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import Video from '~/components/Video';
import httpRequest from '~/utils/httpRequest';

function Home() {
  const [page, setPage] = useState(0);
  const [videos, setVideos] = useState([]);
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const { activation_token } = useParams();
  const navigate = useRef(useNavigate());
  useEffect(() => {
    document.title = 'TopTop - Make Your Day';
  }, []);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post('/user/activation', { activation_token });
          toast.success(res.data.message);
          navigate.current.navigate('/', { replace: true });
        } catch (err) {
          toast.error(err.response.data.message);
        }
      };
      activationEmail();
    }
  }, [activation_token]);

  useEffect(() => {
    const getVideos = async () => {
      await httpRequest
        .get(`/api/videos`, {
          params: { page },
        })
        .then((res) => {
          setVideos([...videos, ...res.data]);
        })
        .catch(() => {});
    };
    const getVideosOrtherUser = async () => {
      await httpRequest
        .get(`/api/videos_orther_user`, {
          params: { page },
          headers: { Authorization: token, withCredentials: true },
        })
        .then((res) => {
          setVideos([...videos, ...res.data]);
        })
        .catch(() => {});
    };
    auth.isLogged ? getVideosOrtherUser() : getVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, auth.isLogged]);
  function loadPage() {
    if (videos.length >= 10) {
      setPage(page + 1);
    } else {
      setPage(0);
    }
  }
  return (
    <InfiniteScroll dataLength={videos.length} next={loadPage} hasMore={true}>
      <div>{videos && videos.map((result) => <Video key={result._id} data={result} id={result._id} />)}</div>
    </InfiniteScroll>
  );
}

export default Home;
