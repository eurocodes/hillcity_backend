const multer = require('multer');

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/");
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        console.log("Filename:", name);
        const extention = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extention);
    }
});

module.exports = multer({ storage: storage }).single('file');