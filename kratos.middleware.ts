import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { edgeConfig } from "@ory/integrations/next";
import cookieParser from "cookie";
import { Configuration, FrontendApi } from "@ory/kratos-client-fetch";

export default async function kratosMiddleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (token) {
    const decodedToken = Buffer.from(token, "base64url").toString("utf-8");
    const [username, password] = decodedToken.split(":");

    const frontendConfig = new Configuration({
      // basePath: "http://localhost:3000/api/.ory",
      basePath: edgeConfig.basePath,
      headers: { Accept: "application/json" },
      fetchApi: cookieFetch()
    });
    const kratos = new FrontendApi(frontendConfig);

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

      const cookiesToSet = successFlow.raw.headers.get("set-cookie");
      if (cookiesToSet) {
        const cookies = parseCookies(cookiesToSet);
        for (const key in cookies) {
          request.cookies.set(key, cookies[key]);
        }
      }

      const response = NextResponse.next({ request: request });
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// parseCookies converts cookies in Set-Cookie format into a request cookie format.
function parseCookies(cookies: string): Record<string, string> {
  const headers: Record<string, string> = {};

  const parsed = cookieParser.parse(cookies);
  for (const key in parsed) {
    if (key.startsWith("SameSite")) {
      // This extracts the ory_kratos_session cookie.
      const value = parsed[key].replace("Lax,", "").trim();
      const splits = value.split("=");
      headers[splits[0]] = splits[1];
    }

    if (key.startsWith("csrf_token_")) {
      headers[key] = parsed[key];
    }
  }

  return headers;
}

// cookieFetch keeps track of the cookies during the login flow.
// We need this as we're using BrowserFlow on the server side.
// Only browser flow returns the cookies in the response.
function cookieFetch() {
  let jar = "";

  return async (input: RequestInfo, init: RequestInit = {}) => {
    const headers = new Headers(init.headers ?? {});
    if (jar) headers.set("cookie", jar);

    const res = await fetch(input, {
      ...init,
      headers,
      credentials: "include"
    });

    const set = res.headers.get("set-cookie");
    if (set) jar = set;

    return res;
  };
}
