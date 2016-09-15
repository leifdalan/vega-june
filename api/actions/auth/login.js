import config from 'config';
import jwt from 'jsonwebtoken';

export default function login(req) {
  console.log('logging in');

  return new Promise((resolve, reject) => {
    if (req.body.password === config.password) {
      const user = {
        id: 1,
        name: 'anyone',
      };
      const token = jwt.sign(user, config.authSecret, {
        expiresIn: '60d'
      });
      console.error('token', token);
      const userLogged = Object.assign(user, { token });
      req.session.user = userLogged;
      resolve(userLogged);
    } else {
      reject({
        status: 401,
        password: 'Incorrect Password',
        _error: 'Login failed'
      });
    }
  });
}
