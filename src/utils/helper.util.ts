export const cn = (...classes: string[]) => {
  return classes.join(" ");
};

export const maskEmail = (email: string) => {
  if (email?.trim()?.length) {
    const length = email.length;
    const maskCharLegth = Math.ceil(length / 3);
    const maskChar = email.slice(3, maskCharLegth + 3);
    const maskedEmail = email.replace(maskChar, "****");
    return maskedEmail;
  }
  return email;
};
