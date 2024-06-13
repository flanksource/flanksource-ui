import { Configuration, FrontendApi } from "@ory/client";
import { edgeConfig } from "@ory/integrations/next";

const frontendApi = new FrontendApi(new Configuration(edgeConfig));

export default frontendApi;
