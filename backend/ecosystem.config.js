module.exports = {
  apps: [{
    name: 'prepforge-backend',
    script: './dist/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
