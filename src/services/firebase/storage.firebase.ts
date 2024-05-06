import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from ".";

export const uploadFileToFireStorage = async (
  file: File,
  folderPath: string = "/images",
  fileName?: string,
) => {
  const storageRef = ref(
    storage,
    `${folderPath}/${fileName || file.name}-${Date.now()}`,
  );
  const snapshot = await uploadBytes(storageRef, file);
  const fullPath = await getDownloadURL(storageRef);
  console.log({ snapshot });
  return fullPath;
};
