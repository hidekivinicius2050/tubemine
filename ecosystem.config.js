module.exports = {
  apps: [
    {
      name: 'tubemine-saas',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/tubemine-saas',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/tubemine-saas/err.log',
      out_file: '/var/log/tubemine-saas/out.log',
      log_file: '/var/log/tubemine-saas/combined.log',
      time: true
    }
  ]
}
