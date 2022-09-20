import { combineReducers } from 'redux';
import auth from './authReducer';
import token from './tokenReducer';
import users from './usersReducer';

const rootReducer = combineReducers({
  auth,
  token,
  users,
});

export default rootReducer;
