import httpRequest from '~/utils/httpRequest';
import ACTIONS from './index';

export const fetchAllUsers = async (token) => {
  const res = await httpRequest.get('/user/all_infor', {
    headers: { Authorization: token },
  });
  return res;
};

export const dispatchGetAllUsers = (res) => {
  return {
    type: ACTIONS.GET_ALL_USERS,
    payload: res.data,
  };
};
