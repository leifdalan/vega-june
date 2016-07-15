import { logout } from 'redux/modules/auth';
import { push } from 'react-router-redux';

export const mapStateToProps = state => ({
  notifs: state.notifs,
  user: state.auth.user
});

export const boundActions = {
  logout,
  pushState: push,
};
