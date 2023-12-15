import { config } from "@/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/services/db/connect.db";
import { fetchAllUsers } from "@/services/db/functions/users.functions";

export default async function AlbumRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed!" });
  }
  const cookies = req.cookies;
  try {
    const db = await connectDB();
    const data = await fetchAllUsers();
    console.log({ data });

    console.log({ cookies, source: "from album/add :POST method" });
    res.status(200).json({
      success: true,
      message: "Request is processing..",
      data: data,
    });
  } catch (err) {
    console.log("err:", err);
    res.status(503).json({ message: "Service unavailable." });
  }
}
