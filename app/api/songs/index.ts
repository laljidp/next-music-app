import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  status: string;
};

export default function songsRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({
    status: `running > ${Date().toLocaleString()}`,
  });
}
