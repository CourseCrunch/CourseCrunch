const withCSS = require('@zeit/next-css');
module.exports = withCSS({/* my next config */});
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins(
    [
        [withCSS, { /* plugin config here ... */ }],
    ],
    {
        env: {
            AUTHPORT: 3001,
            CALENDARPORT: 3002,
            DVIZPORT: 3003,
            FRONTENDPORT: 3000,
            PROFILEPORT: 3005,
            WAITLISTPORT: 3006,
            EVALSPORT: 3007,
        },
    },
);
