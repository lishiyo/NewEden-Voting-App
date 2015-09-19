import { Router } from 'express';

// Overall Character Lists

import {
    getStats,
    getCharactersCount,
    getCharactersTop,
    getCharactersBottom
} from '../controllers/characterLists';

let router = Router();

/**
 * GET /api/stats
 * GET /api/characters/count
 * GET /api/characters/top
 * GET /api/characters/shame
 */

router.route('/stats')
    .get(getStats);

router.route('/characters/count')
    .get(getCharactersCount);

router.route('/characters/top')
    .get(getCharactersTop);

router.route('/characters/shame')
    .get(getCharactersBottom);

export default router;
