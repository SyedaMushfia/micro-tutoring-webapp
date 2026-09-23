import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export const deleteCloudinaryImage = async (imageUrl?: string) => {
    if (!imageUrl || typeof imageUrl !== "string") return false;

    try {
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split("/").filter(Boolean);
        const uploadIndex = pathParts.findIndex((part) => part === "upload");

        if (uploadIndex === -1) return false;

        const resourceParts = pathParts.slice(uploadIndex + 2).filter(Boolean);
        if (!resourceParts.length) return false;

        const normalizedParts = resourceParts[0]?.startsWith("v") ? resourceParts.slice(1) : resourceParts;
        if (!normalizedParts.length) return false;

        const publicId = normalizedParts
            .map((part) => part.replace(/\.[^/.]+$/, ""))
            .join("/");

        if (!publicId) return false;

        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch {
        return false;
    }
};

export default cloudinary;