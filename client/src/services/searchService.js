import * as httpRequest from '~/utils/httpRequest';

export const search = async (user) => {
  try {
    const res = await httpRequest.get('/user/searchUser', {
      params: {
        user,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
