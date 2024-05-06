import { twMerge } from "tailwind-merge";

export const cn = (...classes: string[]) => {
  return twMerge(...classes);
};

export const maskEmail = (email: string) => {
  if (email?.trim()?.length) {
    const length = email.length;
    const maskCharLength = Math.ceil(length / 3);
    const maskChar = email.slice(3, maskCharLength + 3);
    const maskedEmail = email.replace(maskChar, "****");
    return maskedEmail;
  }
  return email;
};

export const cleanAudioFileName = (name: string) => {
  if (!name) return "";

  const regexNum = new RegExp(/\d+./);
  return name
    .replace("(PagalWorld.com.pe)", "")
    .replace(regexNum, "")
    .replace(".mp3", "")
    .replace("Kbps", "")
    .trim();
};
