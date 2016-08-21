import React, { Component } from 'react';
import { reduxForm, propTypes } from 'redux-form';
import loginValidation from './loginValidation';
import { Button } from 'react-bootstrap';
@reduxForm({
  form: 'login',
  fields: ['email', 'password'],
  validate: loginValidation
})
export default class LoginForm extends Component {
  static propTypes = {
    ...propTypes
  }

  state = {
    showPassword: false
  }

  handleCheckbox = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  }

  render() {
    const {
      handleCheckbox,
      props: {
        fields: {
          password: {
            onBlur,
            onChange,
            onDragStart,
            onDrop,
            onFocus,
            onUpdate,
            error: passwordError,
            touched,
            name
          }
        },
        handleSubmit,
        error
      },
      state: {
        showPassword,
      },
    } = this;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={`form-group ${error && touched ? 'has-error' : ''}`}>
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onFocus={onFocus}
              onUpdate={onUpdate}
            />
            {passwordError && touched && <div className="text-danger"><strong>{passwordError}</strong></div>}
          </div>
        </div>
        <label
          style={{
            marginBottom: 15,
            textAlign: 'center',
            width: '100%'
          }}
        >
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handleCheckbox}
            style={{
              marginRight: 10
            }}
          />
        <span style={{
            fontWeight: 'normal'
          }}>Show password</span>
        </label>


        {error && <p className="text-danger"><strong>{error}</strong></p>}
        <div>
          <Button
            block
            type="submit"
            bsSize="large"
            bsStyle="success"
          >
            <i className="fa fa-sign-in" />{' '}Log In
          </Button>
        </div>
      </form>
    );
  }
}
