require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'MYSQL_DATABASE_URL',
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL',
  },
  production: {
    use_env_variable: 'PRODUCTION_DATABASE_URL',
  },
};
