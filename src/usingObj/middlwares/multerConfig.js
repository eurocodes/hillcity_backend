const multer = require('multer');

const DateTime = require('./DateTime');

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
        callback(null, "uploads");
    },

    filename: (req, file, callback) => {
        const id = req.user.id.split("-")[2]
        const randomNum = Math.floor(Math.random() * 100)
        const date = DateTime.generateDateTime().split(" ").join("_")
        const fileName = file.originalname.split(" ").join("_");
        const name = fileName.split(".")[0]
        const extention = MIME_TYPES[file.mimetype];
        callback(null, "ENG_" + id + "_" + randomNum + "_" + name + "_" + date + "." + extention);
    }
});

module.exports = multer({ storage: storage }).single('file');