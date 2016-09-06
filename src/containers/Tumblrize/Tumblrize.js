import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Button } from 'react-bootstrap';
import { updateTumblr } from 'redux/modules/info';

@connect(
  state => ({ user: state.auth.user }),
  { updateTumblr })
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    notifSend: PropTypes.func
  }

  updateTumblr = () => this.props.updateTumblr()

  render() {
    return (
      <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
        <div>
          <h1 style={{textAlign: 'center'}}>
            TUMBLRIZE
          </h1>
          <small style={{
              textAlign: 'center',
              display: 'block'
            }}>update feed</small>
          <br />
            <Helmet title="Login" />
              <Button
                block
                onClick={this.updateTumblr}
                bsSize="large"
                bsStyle="success"
              >
                <i className="fa fa-sign-in" />{' '}Update
              </Button>


        </div>
      </div>
    );
  }
}
