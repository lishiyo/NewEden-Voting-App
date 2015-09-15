import { Router } from 'express';

import characterRoutes from 'routes/characters';

let router = new Router();
router.use('/characters', characterRoutes);

export default router;
