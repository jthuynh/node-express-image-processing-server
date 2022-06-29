const { json } = require('body-parser');
const { Router } = require('express');
const Multer = require('multer');

const router = Router();
const upload = multer({
    fileFilter: fileFilter(),
    storage: storage
});

const storage = Multer.diskStorage({
    destination: 'api/uploads/',
    filename: filename()
});

function filename(request, file, callback) {
    callback(null, file.originalname);
}

function fileFilter(request, file, callback) {
    if (file.mimetype != 'image/png'){
        request.fileValidationError = 'Wrong file type';
        callback(null, false, new Error(request.fileValidationError));
    } else {
        callback(null, true);
    }
}

router.post('/upload', upload.single('photo'), ((request, response) => {
    if (request.fileValidationError) {
        response.status(400);
        json({error: request.fileValidationError});
    } else {
        response.status(201);
        json({success: true});
    }
}))
module.exports = router;