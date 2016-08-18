import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/lib/Alert';
import throttle from 'lodash/throttle';
import { Login } from 'containers';
import { Link } from 'react-router';
import { isBoolean } from 'lodash';
// import Helmet from 'react-helmet';
import {
  isLoaded as isInfoLoaded,
  load as loadInfo
} from 'redux/modules/info';
import {
  isLoaded as isAuthLoaded,
  load as loadAuth
} from 'redux/modules/auth';
import { Notifs } from 'components';
import {
  mapStateToProps,
  boundActions,
  propTypes
} from './AppSelectors';
// import config from 'config';
import { asyncConnect } from 'redux-async-connect';
import Radium from 'radium';
import {
  NOTIFS,
  APP_CONTENT,
  APP_CONTAINER_STYLE,
} from './App.styles';

@Radium
@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    return Promise.all(promises);
  }
}])
@connect(mapStateToProps, boundActions)
export default class App extends Component {
  static propTypes = propTypes;

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.setBrowser();
    window.addEventListener('resize', throttle(this.props.setWindow, 250));
    window.addEventListener('scroll', throttle(this.props.setScroll, 250));
    this.props.setWindow();
    this.props.setScroll();
    console.error('this.refs.appContainer', this.refs.appContainer.getBoundingClientRect().width);
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const {
      notifs,
      // logout,
      user,
      location: {
        pathname
      },
      pageLoaded
    } = this.props;
    const isHome = pathname === '/';
    return (
      <div
        style={APP_CONTAINER_STYLE}
        ref="appContainer"
      >

        {/* <Helmet {...config.app.head} />*/}
        {isHome ?
          <Link to="/archive">ARCHIVE</Link>
          :
          <Link to="/">HOME</Link>
        }
        {isBoolean(pageLoaded) && !pageLoaded && 'loading...'}
        <div style={APP_CONTENT}>
          {notifs.global && <div className="container">
            <Notifs
              style={NOTIFS}
              namespace="global"
              NotifComponent={props => <Alert bsStyle={props.kind}>{props.message}</Alert>}
            />
          </div>}
          {user ? this.props.children : <Login />}

        </div>
      </div>
    );
  }
}
