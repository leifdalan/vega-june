import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import { Link } from 'react-router';
import isBoolean from 'lodash/isBoolean';
import Helmet from 'react-helmet';
import config from '../../../config/default';
import {
  loadRemaining,
} from 'redux/modules/info';
import CSSTransitionGroup from 'react-addons-css-transition-group';
// import Helmet from 'react-helmet';
import {
  isLoaded as isAuthLoaded,
  load as loadAuth
} from 'redux/modules/auth';
import {
  mapStateToProps,
  boundActions,
  propTypes
} from './AppSelectors';
// import config from 'config';
import { asyncConnect } from 'redux-async-connect';
import Radium from 'radium';
import {
  APP_CONTENT,
  APP_CONTAINER_STYLE,
  MENU_LINK_STYLES
} from './App.styles';

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
    const {
      setWindow,
      setScroll,
      setBrowser,
      setTouch,
    } = this.props;
    setBrowser();
    window.addEventListener('resize', throttle(setWindow, 250));
    window.addEventListener('scroll', throttle(setScroll, 250));
    setWindow();
    setScroll();
    setTouch();
  }

  render() {
    const {
      props: {
        logout,
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
        <Helmet {...config.app.head} />
        {sidebar}

        {isHome ?
          <div
            style={{
              ...MENU_LINK_STYLES,
              textAlign: 'right'
            }}
          >
            <Link to="/archive">ARCHIVE</Link>
          </div>

          :
          <div style={MENU_LINK_STYLES}>
            <Link to="/">HOME</Link>
          </div>

        }
        {__DEVELOPMENT__ && <button onClick={logout}>logout</button>}
        {/*<CSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >

          {(isBoolean(pageLoaded) && !pageLoaded) ? <h1>loading</h1> : <span />}
        </CSSTransitionGroup>*/}

        <main
          id="page-wrap"
          style={APP_CONTENT}
        >
          {user && children}
          {user && content}
        </main>
      </div>
    );
  }
}
