import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationFolder;
        switch (file.fieldname) {
            case "profile":
                destinationFolder = "./src/uploads/profiles";
                break;
            case "products":
                destinationFolder = "./src/uploads/products";
                break;
            case "document":
                destinationFolder = "./src/uploads/documents";
                break;
            default:
                destinationFolder = "./src/uploads/other";

        }

        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}_${Date.now()}${extension}`);
    }
});

const upload = multer({ storage: storage });

export default upload;

