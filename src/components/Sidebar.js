import React, { Component } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  getTagsSelector,
} from 'redux/modules/info';
import {
  BURGER_STYLES
} from 'containers/App/App.styles';
import { scaleRotate as Menu } from 'react-burger-menu';
import { Link } from 'react-router';

@connect(createSelector(getTagsSelector, tags => ({ tags })), {})
export default class Sidebar extends Component {
  constructor(args) {
    super(...args);
  }

  state = {
    menuOpen: false
  }

  toggleMenu = () => this.setState({ menuOpen: !this.state.menuOpen })

  render() {
    const {
      toggleMenu,
      state: {
        menuOpen
      },
      props: {
        tags,
      }
    } = this;
    return (
      <aside>
        <Menu
          isOpen={menuOpen}
          right
          customBurgerIcon={false}
          styles={BURGER_STYLES}
          pageWrapId={"page-wrap"}
          outerContainerId={"outer-container"}
          >
          <ul>
            {tags.map(tag =>
              <li key={tag}>
                <Link
                  to={`/archive/tag/${tag}`}
                  onClick={toggleMenu}
                  >
                  {tag}
                </Link>
              </li>
            )}
          </ul>
        </Menu>
        <a
          onClick={toggleMenu}
          style={{ float: 'right' }}
        >
          TAGS
        </a>
      </aside>
    );
  }
}
