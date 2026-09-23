import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export const deleteCloudinaryImage = async (imageUrl?: string) => {
    if (!imageUrl || typeof imageUrl !== "string") return false;

    try {
        const rawValue = imageUrl.trim();

        if (!rawValue) return false;

        const candidates = [rawValue];
        if (rawValue.includes("/upload/")) {
            const pathMatch = rawValue.match(/\/upload\/(?:v\d+\/)?(.+)$/i);
            if (pathMatch?.[1]) candidates.push(pathMatch[1]);
        }

        for (const entry of candidates) {
            try {
                const cleanedEntry = entry.includes("http") ? new URL(entry).pathname : entry;
                const pathParts = cleanedEntry.split("/").filter(Boolean);
                const uploadIndex = pathParts.findIndex((part) => part === "upload");
                const resourceParts = uploadIndex >= 0 ? pathParts.slice(uploadIndex + 2).filter(Boolean) : pathParts;

                if (!resourceParts.length) continue;

                const normalizedParts = resourceParts[0]?.startsWith("v") ? resourceParts.slice(1) : resourceParts;
                const publicId = normalizedParts
                    .map((part) => part.replace(/\.[^/.]+$/, ""))
                    .join("/");

                if (!publicId) continue;

                await cloudinary.uploader.destroy(publicId, { invalidate: true });
                return true;
            } catch {
                // continue to the next candidate format
            }
        }

        return false;
    } catch {
        return false;
    }
};

export default cloudinary;