# Configuration

This directory contains configuration files for the frontend application.

## config.js

The main configuration file that centralizes all API endpoints and backend URLs.

### Usage

```javascript
import config from '../config/config';

// Use the API base URL
const response = await axios.get(`${config.apiBaseURL}/blogs`);

// Use the backend URL directly
const response = await axios.get(`${config.backendURL}/uploads/image.jpg`);
```

### Environment Variables

To customize the backend URL, create a `.env` file in the frontend root directory:

```bash
REACT_APP_BACKEND_URL=http://localhost:5000
```

If no environment variable is set, it will default to `http://localhost:5000`.

### Available Configurations

- `backendURL`: The base URL of the backend server
- `apiBaseURL`: The base URL for API endpoints (includes `/api` suffix)
