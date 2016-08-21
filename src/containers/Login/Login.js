import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { LoginForm } from 'components';
import * as authActions from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';

@connect(
  state => ({ user: state.auth.user }),
  { ...notifActions, ...authActions })
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    notifSend: PropTypes.func
  }

  login = data => this.props.login(data)

  render() {
    const { user, logout } = this.props;
    return (
      <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
        <div>
          <h1 style={{textAlign: 'center'}}>
            Login
          </h1>
          <small style={{
              textAlign: 'center',
              display: 'block'
            }}>to see baby</small>
          <br />
            <Helmet title="Login" />
            <LoginForm onSubmit={this.login} />

        </div>
      </div>
    );
  }
}
