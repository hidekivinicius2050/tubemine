module.exports = {
  apps: [
    {
      name: 'tubemine',
      script: 'node',
      args: '.next/standalone/server.js',
      cwd: '/var/www/tubemine',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/tubemine/err.log',
      out_file: '/var/log/tubemine/out.log',
      log_file: '/var/log/tubemine/combined.log',
      time: true
    }
  ]
}
