import multer from "multer";

const upload = multer({ dest: "uploads/" }); // relative to project root!

export default upload;