const {
    DB_HOST,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_DOCKER_PORT,
  } = process.env;
  const MONGODB_DATABASE = "pelotonpast_db";
  
  module.exports = {
    url: `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${DB_HOST}:${MONGODB_DOCKER_PORT}/${MONGODB_DATABASE}?authSource=admin`
  };