import { handler } from './build/handler.js';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Proxy middleware configuration
const apiProxy = createProxyMiddleware({
	target: 'http://localhost:8000/api/', // Replace with your API server URL
	changeOrigin: true
	// pathRewrite: {
	// 	'^/api': '' // Remove /api prefix when forwarding the request
	// }
});

app.use('/api', apiProxy);

// SvelteKit handler
app.use(handler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
