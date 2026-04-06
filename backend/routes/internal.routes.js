import { Router } from 'express';
import { nudgeGenerateStub } from '../controllers/dashboard.controller.js';

const router = Router();

router.post('/nudge/generate', nudgeGenerateStub);

export default router;
