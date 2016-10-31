import React, { Component } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  getTagsSelector,
} from 'redux/modules/tumblr';
import { Link } from 'react-router';
import { MENU_LINK_STYLES } from '../containers/App/App.styles';

@connect(createSelector(getTagsSelector, tags => ({ tags })), {})
export default class Sidebar extends Component {
  constructor(args) {
    super(...args);
  }

  state = {
    menuOpen: false
  }

  toggleMenu = () => this.setState({ menuOpen: !this.state.menuOpen })

  determineLeft = () => {
    const {
      props: {
        swipeProgress,
        isSwiping,
        stoppedSwiping,
      },
      state: {
        menuOpen,
      }
    } = this;
    return menuOpen
      ? 0
      : '-100%'
    switch (true) {
      case (isSwiping):
        return `${-(swipeProgress / 300) * 100}%`;
      case (stoppedSwiping):
        return (swipeProgress > 150)
          ? 0
          : '-100%';
      default:
        return;

    }
  }

  render() {
    const {
      determineLeft,
      toggleMenu,
      state: {
        menuOpen
      },
      props: {
        tags,
        swipeProgress,
        isSwiping,
        stoppedSwiping,
      }
    } = this;

    const left = determineLeft();
    const leftPosition = isSwiping
      ? `${-(swipeProgress / 300) * 100}%`
      : menuOpen
        ? '-100%' : 0;

    return (
      <aside style={{position: 'absolute', top: 0}}>
        <a
          onClick={toggleMenu}
          style={{
            ...MENU_LINK_STYLES,
            color: 'black',
            float: 'right',
            position: 'fixed',
            zIndex: 10,
            display: 'block',
            boxShadow: '0px 0px 30px white',
            padding: 10,
            marginLeft: 15,
            marginTop: 5,
            top: 0,
            textDecoration: 'none',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.85)',
          }}
        >
          MENU
        </a>
        <div
          style={{
            zIndex: menuOpen ? 9 : -1,
            position: 'fixed',
            background: menuOpen
              ? 'rgba(0,0,0,0.5)'
              : 'rgba(0,0,0,0)',
            transition: 'background 1s',
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
          }}
          onClick={toggleMenu}
        />
        <div
          style={{
            zIndex: 10,
            position: 'fixed',
            left,
            transition: isSwiping ? undefined : 'left 1s',
            backgroundColor: 'rgba(225, 225, 255, 0.95)',
            height: '100%',
            padding: '0 40px',
            overflow: 'scroll',
          }}

        >
          <a
            onClick={toggleMenu}
            style={{
              ...MENU_LINK_STYLES,
              zIndex: 10,
              display: 'flex',
              top: 0,
              justifyContent: 'space-between',
              width: 150
            }}
          >
            <span>
              CLOSE
            </span>
            <span>
              ✖
            </span>
          </a>
          <ul
            style={{ padding: 0 }}
          >
            <li
              style={{
                listStyle: 'none',
                ...MENU_LINK_STYLES,
              }}
            >
              <Link
                to="/"
                onClick={toggleMenu}
              >
                HOME
              </Link>
            </li>
            <li
              style={{
                listStyle: 'none',
                ...MENU_LINK_STYLES,
              }}
            >
              <Link
                to="/archive"
                onClick={toggleMenu}
              >
                ARCHIVE
              </Link>
            </li>
            <li
              style={{
                listStyle: 'none',
                ...MENU_LINK_STYLES,
              }}

            >
              <Link
                to="/videos"
                onClick={toggleMenu}
              >
                VIDEOS
              </Link>
            </li>
            <li
              style={{
                listStyle: 'none',
                ...MENU_LINK_STYLES,
                textDecoration: 'underline',
              }}

            >
              TAGS:
            </li>
            {tags.map(tag =>
              <li
                key={tag}
                style={{
                  listStyle: 'none',
                  ...MENU_LINK_STYLES,
                }}
                >
                <Link
                  to={`/archive/tag/${tag}`}
                  onClick={toggleMenu}
                  >
                  {tag}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </aside>
    );
  }
}
