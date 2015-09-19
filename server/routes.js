import { Router } from 'express';

import characterLists from './routes/characterLists';
import characterRoutes from './routes/characters';
import characterActions from './routes/characterActions';

let router = new Router();

router.use('/', characterLists);
router.use('/characters', characterRoutes);
router.use('/', characterActions);

export default router;
