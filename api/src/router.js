const { json } = require('body-parser');
const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const imageProcessor = require('./imageProcessor');

const router = Router();
const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

router.get('/photo-viewer', (request, response) => {
    response.sendFile(photoPath);
})

function filename(request, file, callback) {
    callback(null, file.originalname);
}
const storage = multer.diskStorage({
    destination: 'api/uploads/',
    filename: filename
});

const upload = multer({
    fileFilter: fileFilter,
    storage: storage
});


function fileFilter(request, file, callback) {
    if (file.mimetype !== 'image/png'){
        request.fileValidationError = 'Wrong file type';
        callback(null, false, new Error('Wrong file type'));
    } else {
        callback(null, true);
    }
}

router.post('/upload', upload.single('photo'), (async (request, response) => {
    if (request.fileValidationError) {
        response.status(400).json({error: request.fileValidationError});
    } else {
        response.status(201).json({success: true});
    }

    try {
        await imageProcessor(request.file.filename);
    } catch (error) {
        
    }
}))

module.exports = router;