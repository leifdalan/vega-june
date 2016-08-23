import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/lib/Alert';
import throttle from 'lodash/throttle';
import { Link } from 'react-router';
import isBoolean from 'lodash/isBoolean';

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
// import 'react-html5video/dist/ReactHtml5Video.css';

@Radium
@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
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
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const {
      handleLogout,
      props: {
        notifs,
        // logout,
        user,
        location: {
          pathname
        },
        pageLoaded,
        children,
        content,
        sidebar
      }
    } = this;
    if (!user) return children;
    const isHome = pathname === '/';
    return (
      <div
        style={APP_CONTAINER_STYLE}
        ref="appContainer"
        id="outer-container"
      >

        {sidebar}
        {/* <Helmet {...config.app.head} />*/}
        {isHome ?
          <Link to="/archive">ARCHIVE</Link>
          :
          <Link to="/">HOME</Link>
        }
        <button onClick={handleLogout}>logout</button>
        {isBoolean(pageLoaded) && !pageLoaded && 'loading...'}
        <main
          id="page-wrap"
          style={APP_CONTENT}
        >
          {notifs.global && <div className="container">
            <Notifs
              style={NOTIFS}
              namespace="global"
              NotifComponent={props => <Alert bsStyle={props.kind}>{props.message}</Alert>}
            />
          </div>}
          {user && children}
          {user && content}
        </main>
      </div>
    );
  }
}
