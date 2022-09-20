import * as httpRequest from '~/utils/httpRequest';

export const search = async (q, type = 'less') => {
  try {
    const res = await httpRequest.get('https://tiktok.fullstack.edu.vn/api/users/search', {
      params: {
        q,
        type,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
