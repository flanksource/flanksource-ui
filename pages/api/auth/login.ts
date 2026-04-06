import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;
  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    },
    body: JSON.stringify(req.body)
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.setHeader("set-cookie", setCookie);
  }

  const text = await response.text();
  res.status(response.status);
  res.send(text);
}
