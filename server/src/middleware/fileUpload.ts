import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

function fileUpload(folder: string) {

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req, file) => ({
            folder: folder,
        })
    })

    return multer({ storage });
}

export default fileUpload;