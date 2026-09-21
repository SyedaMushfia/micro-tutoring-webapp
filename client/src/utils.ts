import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
  withCredentials: true,
});

export const optimizeImageFile = async (
  file: File,
  {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
  }: { maxWidth?: number; maxHeight?: number; quality?: number } = {},
): Promise<File> => {
  if (!file.type.startsWith("image/")) return file;

  const reader = new FileReader();

  const dataUrl = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file for image optimization."));
    reader.readAsDataURL(file);
  });

  return await new Promise<File>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      if (!context) {
        resolve(file);
        return;
      }

      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        },
        "image/jpeg",
        quality,
      );
    };

    image.onerror = () => reject(new Error("Failed to load image for optimization."));
    image.src = dataUrl;
  });
};

export const getOptimizedCloudinaryUrl = (
  url?: string,
  { width = 400, height, crop = "fit" }: { width?: number; height?: number; crop?: string } = {},
) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const transforms = ["q_auto", "f_auto"];
  if (width) transforms.push(`w_${Math.round(width)}`);
  if (height) transforms.push(`h_${Math.round(height)}`);
  if (crop) transforms.push(`c_${crop}`);

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
};

// export const validateEmail = (email: string) => {
//     return String(email)
//       .toLowerCase()
//       .match(
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//       );
//   };