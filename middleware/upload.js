import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { files: 10, fileSize: 8 * 1024 * 1024 }, // 8MB each
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image uploads are allowed"));
  },
});

export default upload;
