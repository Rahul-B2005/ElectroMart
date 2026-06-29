const express = require('express');
const router = express.Router();
// Cart is handled client-side (localStorage), but this route exists for server-side cart sync
router.get('/', (req, res) => res.json({ message: 'Cart is managed client-side' }));
module.exports = router;
