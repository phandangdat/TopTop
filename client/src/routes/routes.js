import config from '~/config';

// Layouts
import { HeaderOnly } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import Message from '~/pages/Message';
import Search from '~/pages/Search';
import Live from '~/pages/Live';
import Logout from '~/pages/Logout';
import FullView from '~/layouts/FullView';
import NotFound from '~/pages/NotFound';

// Public routes
const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.following, component: Following },
  { path: config.routes.live, component: Live },
  { path: config.routes.profile, component: Profile, layout: FullView },
  { path: config.routes.upload, component: Upload, layout: HeaderOnly },
  { path: config.routes.messages, component: Message, layout: HeaderOnly },
  { path: config.routes.search, component: Search, layout: null },
  { path: config.routes.auth, component: Home },
  { path: config.routes.logout, component: Logout },
  { path: '*', component: NotFound, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
