import { handler } from './build/handler.js';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const API_URL = process.env.API_URL || 'http://host.docker.internal:8000';

// Middleware to log all incoming requests
app.use((req, res, next) => {
	console.log('Incoming request:', req.method, req.url);
	next();
});

// Proxy middleware configuration
const apiProxy = createProxyMiddleware({
	target: API_URL,
	changeOrigin: true,
	logLevel: 'debug',
	pathRewrite: function (path, req) {
		return path.startsWith('/api') ? path : `/api${path}`;
	},
	onError: (err, req, res) => {
		console.error('Proxy Error:', err);
		res.status(500).send('Proxy Error');
	}
});

// Use the proxy for any request that starts with /api
app.use('/api', (req, res, next) => {
	// Adjust the URL to include /api prefix
	req.url = `/api${req.url}`;
	return apiProxy(req, res, next);
});

// SvelteKit handler
app.use((req, res, next) => {
	return handler(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	console.log(`API requests will be proxied to: ${API_URL}`);
});
