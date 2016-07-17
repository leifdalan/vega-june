import config from 'config';
import jwt from 'jsonwebtoken';

export default function login(req) {
  console.log('logging in');

  return new Promise((resolve, reject) => {
    if (req.body.password === 'dontworrybeyonce') {
      const user = {
        id: 1,
        name: 'anyone',
      };
      console.error('config.authSecret', config.authSecret);
      const token = jwt.sign(user, config.authSecret, {
        expiresIn: 60000
      });
      const userLogged = Object.assign(user, { token });
      req.session.user = userLogged;
      resolve(userLogged);
    } else {
      reject();
    }
  });
}
