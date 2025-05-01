import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { edgeConfig } from "@ory/integrations/next";

import { Configuration, FrontendApi } from "@ory/kratos-client-fetch";

export default async function kratosMiddleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (token) {
    const decodedToken = Buffer.from(token, "base64url").toString("utf-8");
    const [username, password] = decodedToken.split(":");

    // Initialize Kratos client
    const kratos = new FrontendApi(
      new Configuration({
        basePath: "http://localhost:3000/api/.ory",
        headers: { Accept: "application/json" },
        fetchApi: cookieFetch()
      })
    );

    try {
      const flow = await kratos.createBrowserLoginFlow({});
      const node = flow.ui.nodes.find(
        (n) =>
          n.attributes.node_type === "input" &&
          n.attributes.name === "csrf_token"
      );
      const csrf_token =
        node?.attributes.node_type === "input"
          ? node?.attributes.value
          : undefined;

      const successFlow = await kratos.updateLoginFlowRaw({
        flow: flow.id,
        updateLoginFlowBody: {
          csrf_token: csrf_token,
          method: "password",
          identifier: username,
          password: password
        }
      });
      console.log(
        `session token: ${successFlow.raw.headers.get("set-cookie")}`
      );

      request.headers.set("cookie", successFlow.raw.headers.get("set-cookie")!);

      // Create response with the session cookie
      const response = NextResponse.next();

      // The session cookie will be automatically set by Kratos
      // We just need to ensure it's included in the response
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// cookie-jar.ts
export function cookieFetch() {
  let jar = ""; // holds latest Set-Cookie header(s)

  return async (input: RequestInfo, init: RequestInit = {}) => {
    // ―― outbound: attach cookie we have ——————————————
    const headers = new Headers(init.headers ?? {});
    if (jar) headers.set("cookie", jar);

    // call the real fetch
    const res = await fetch(input, {
      ...init,
      headers,
      credentials: "include"
    });

    // ―― inbound: remember new cookies ————————————————
    const set = res.headers.get("set-cookie");
    if (set) jar = set; // (add logic if you need a full jar)

    return res;
  };
}
