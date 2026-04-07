import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const name = file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueSuffix + '-' + name);
    }
});

export const upload = multer({ storage })

