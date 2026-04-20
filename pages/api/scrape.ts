import type { NextApiRequest, NextApiResponse } from "next";
import { sampleScrapeSnapshot } from "@flanksource-ui/scrapeui/sampleSnapshot";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(sampleScrapeSnapshot);
}
