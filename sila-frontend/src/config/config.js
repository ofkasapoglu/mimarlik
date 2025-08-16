const config = {
  backendURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  apiBaseURL: `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api`
};

export default config;
