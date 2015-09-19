import { Router } from 'express';

// Report, Find, Get Info for a single Character

import {
    reportCharacter,
    searchCharacter,
    getCharacterDetail
} from '../controllers/characterActions';

let router = Router();

/**
 * POST /api/report
 * GET /api/characters/search
 * GET /api/characters/:id
 */

router.route('/report')
    .post(reportCharacter);

router.route('/characters/search')
    .get(searchCharacter);

router.route('/characters/:id')
    .get(getCharacterDetail);

export default router;
