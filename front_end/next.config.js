const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

module.exports = withPlugins(
    [
        [withCSS, { /* plugin config here ... */ }],
        [withImages, {}],
    ],
    {
        env: {
            AUTHPORT: 3001,
            CALENDARPORT: 3002,
            DVIZPORT: 3003,
            FRONTENDPORT: 80,
            PROFILEPORT: 3005,
            WAITLISTPORT: 3006,
            EVALSPORT: 3007,
            BASE: 'http://krishchow.me:',
        },
    },
);
