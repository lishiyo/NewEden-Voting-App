import { Router } from 'express';

import { getCharacters } from '../controllers/characters';

let router = Router();

router.route('/characters').get(getCharacters);

export default router;
