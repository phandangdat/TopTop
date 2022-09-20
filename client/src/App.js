import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { publicRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import { dispatchGetUser, dispatchLogin, fetchUser } from './redux/actions/authAction';
import httpRequest from './utils/httpRequest';
function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      httpRequest
        .post('/user/refresh_token', null, { withCredentials: true })
        .then((res) => {
          dispatch({ type: 'GET_TOKEN', payload: res.data.access_token });
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  }, [auth.isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());

        return fetchUser(token).then((res) => {
          dispatch(dispatchGetUser(res));
        });
      };
      getUser();
    }
  }, [token, dispatch]);
  return (
    <Router>
      <div className="App">
        <ToastContainer
          autoClose={3000}
          closeButton={false}
          theme={'dark'}
          position="top-center"
          pauseOnHover={false}
          limit={2}
        />
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
