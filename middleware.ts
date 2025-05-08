import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { edgeConfig } from "@ory/integrations/next";
import { Configuration, FrontendApi } from "@ory/kratos-client-fetch";

export default async function kratosMiddleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (token) {
    const decodedToken = Buffer.from(token, "base64url").toString("utf-8");
    const [username, password] = decodedToken.split(":");

    const backendURL = process.env.BACKEND_URL || "http://localhost:3000/";
    const backendBasePath = new URL(edgeConfig.basePath, backendURL).toString();
    const frontendConfig = new Configuration({
      basePath: backendBasePath,
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

      const setCookies = successFlow.raw.headers.get("set-cookie");
      if (!setCookies) {
        throw new Error("No set-cookie header found");
      }

      // Create a redirect response to the original URL without the token parameter
      const url = new URL(request.url);
      url.searchParams.delete("token");

      const response = NextResponse.redirect(url.toString());
      response.headers.set("set-cookie", setCookies);

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
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
