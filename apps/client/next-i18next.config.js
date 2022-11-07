const { resolve } = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    reloadOnPrerender: process.env.NODE_ENV === 'development',
  },
  localePath: resolve('./apps/client/public/locales'),
};
