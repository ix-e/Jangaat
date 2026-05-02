const express = require('express');
const aiController = require('../ai/analysis-engine/index');
const chatController = require('../ai/analysis-engine/chat');

const router = express.Router();

router.post('/analyze', aiController.analyzeSession);
router.post('/chat', chatController.continueChat);

// TODO: Ajouter routes pour la gestion des sessions complètes en DB
// router.post('/session', sessionController.createSession);
// router.get('/session/:id', sessionController.getSession);

module.exports = router;
