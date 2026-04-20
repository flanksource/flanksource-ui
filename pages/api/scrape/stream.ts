import type { NextApiRequest, NextApiResponse } from "next";
import { sampleScrapeSnapshot } from "@flanksource-ui/scrapeui/sampleSnapshot";

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  const send = (event: string, payload: unknown) => {
    if (event) {
      res.write(`event: ${event}\n`);
    }
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  send("", sampleScrapeSnapshot);
  send("done", {});

  const keepAlive = setInterval(() => {
    res.write(": keepalive\n\n");
  }, 15000);

  req.on("close", () => {
    clearInterval(keepAlive);
    res.end();
  });
}
