const encodeBuffer = (buffer: any) => buffer.toString("base64");

const encodeString = (str: string) => encodeBuffer(Buffer.from(str));

const encodeData = (data: any) => encodeString(JSON.stringify(data));

const encode = (data: any) => {
  if (Buffer.isBuffer(data)) return encodeBuffer(data);
  if (typeof data === "string") return encodeString(data);
  return encodeData(data);
};

const decode = (str: string) => {
  const decoded = Buffer.from(str, "base64").toString();
  try {
    return JSON.parse(decoded);
  } catch (e) {
    return decoded;
  }
};
module.exports = { encode, decode };
