import { Router } from 'express';
import { AssistantController } from '../controllers/assistant.controller';

const router = Router();

// Mapeo del endpoint POST /api/query solicitado en los requerimientos del entregable
router.post('/query', AssistantController.queryAssistant);

export default router;