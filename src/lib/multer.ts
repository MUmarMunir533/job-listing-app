import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("application/")) {
      cb(null, true);
    } else {
      cb(new Error("Only document files are allowed"));
    }
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default upload;
