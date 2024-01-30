import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  health: "ok";
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ health: "ok" });
}
