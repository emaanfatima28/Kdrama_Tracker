const express = require('express');
const router = express.Router();
const multer = require('multer');
const {addDrama, getDramas, deleteDrama, updateDrama} = require('../controllers/dramaController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

router.post('/', upload.single('coverImg'), addDrama);
router.get('/', getDramas);
router.delete('/:id', deleteDrama);
router.put('/:id', upload.single('coverImg'), updateDrama);

module.exports = router;
