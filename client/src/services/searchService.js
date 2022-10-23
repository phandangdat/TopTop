import * as httpRequest from '~/utils/httpRequest';

export const search = async (user) => {
  try {
    const res = await httpRequest.get('/user/search_user', {
      params: {
        user,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
