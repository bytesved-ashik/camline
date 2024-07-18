/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@fullcalendar/react",
  "@fullcalendar/daygrid",
  "@fullcalendar/list",
  "@fullcalendar/timegrid",
]);

module.exports = withTM({
  trailingSlash: true,
  reactStrictMode: true,
  distDir: 'build',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, "./node_modules/apexcharts-clevision"),
    };

    // camel-case style names from css modules
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes("css-loader"))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = "camelCase";
        }
      });

    return config;
  },
  experimental: {
    esmExternals: false,
  },
});
