import { toast } from 'react-toastify';
import * as httpRequest from '~/utils/httpRequest';

export const suggestedAccounts = async (page, per_page) => {
  try {
    const res = await httpRequest.get('https://tiktok.fullstack.edu.vn/api/users/suggested', {
      params: {
        page,
        per_page,
      },
    });
    return res;
  } catch (error) {
    toast.error(error);
  }
};
