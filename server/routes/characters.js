import { Router } from 'express';

// CharactersController

import {
    getCharacters,
    createCharacter,
    updateCharacterPair
} from '../controllers/characters';

let router = Router();

/**
 * GET /api/characters
 * POST /api/characters
 * PUT /api/characters
 */
router.route('/')
    .get(getCharacters)
    .post(createCharacter)
    .put(updateCharacterPair);

export default router;
