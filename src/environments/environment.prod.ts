export const environment = {
  production: true,
  apiUrl: 'api',
  JWT_KEY: "secret_this_should_be_longer"
};

// As during heroku deploy the only node server is delivering
// the angular static pages and also running the backend server
// so there are no need of connecting to localhost....
//so the backend url is trimmed to only api/user/... or api/post/...
