const routes = {
  home: '/',
  following: '/following',
  profile: '/@:nickname',
  upload: '/upload',
  messages: '/messages',
  search: '/search',
  live: '/live',
  auth: '/user/activate/:activation_token',
  logout: '/logout',
};

export default routes;
