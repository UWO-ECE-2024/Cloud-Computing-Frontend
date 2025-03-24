import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a file to Firebase Storage
 * @param file File to upload
 * @param path Storage path (e.g., 'profile-images', 'post-images')
 * @param onProgress Optional callback for upload progress
 * @returns Promise with download URL
 */
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create unique filename
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const storageRef = ref(storage, `${path}/${filename}`);

      // Create upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (onProgress) onProgress(progress);
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              console.error("User doesn't have permission");
              break;
            case "storage/canceled":
              console.error("User canceled the upload");
              break;
            case "storage/unknown":
              console.error("Unknown error occurred");
              break;
          }
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          // Get download URL when upload completes
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        },
      );
    } catch (error) {
      console.error("Setup error:", error);
      reject(error);
    }
  });
};
