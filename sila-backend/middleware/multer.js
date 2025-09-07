import multer from "multer";

// Artık dosyayı disk'e kaydetmiyoruz, RAM'de tutuyoruz
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
