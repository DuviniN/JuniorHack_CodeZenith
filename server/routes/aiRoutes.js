import { Router } from 'express';
import { proxyChat } from '../controllers/aiController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = Router();

// Protected: only authenticated users can call the AI (optional)
// Protected: only authenticated users can call the AI (optional)
router.post('/chat', authRequired, proxyChat);

// Temporary: unprotected test route for debugging the external AI call.
// Use only in local/dev. This allows calling the proxy without an auth token
// to verify GEMINI env vars and network connectivity.
router.post('/test', proxyChat);

export default router;
