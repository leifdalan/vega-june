require('babel-polyfill');

module.exports = {
  host: 'localhost',
  port: 3000,
  apiHost: 'localhost',
  apiPort: 3030,
  app: {
    title: 'Vega June',
    description: 'All the modern best practices in one example.',
    head: {
      titleTemplate: 'Vega June | %s',
      meta: [
        { name: 'description', content: 'All things baby Vega' },
        { charset: 'utf-8' },
        // { property: 'og:site_name', content: 'Vega June' },
        // { property: 'og:image', content: 'https://react-redux.herokuapp.com/logo.jpg' },
        // { property: 'og:locale', content: 'en_US' },
        // { property: 'og:title', content: 'React Redux Example' },
        // { property: 'og:description', content: 'All the modern best practices in one example.' },
        // { property: 'og:card', content: 'summary' },
        // { property: 'og:site', content: '@erikras' },
        // { property: 'og:creator', content: '@erikras' },
        // { property: 'og:image:width', content: '200' },
        // { property: 'og:image:height', content: '200' }
      ]
    }
  },
  redisHost: 'localhost',
  redisPort: '6379',
  authSecret: 'secret',
  redisSecret: 'secret',
  redisUrl: 'redis://localhost:6379'
};
