import { HttpsProxyAgent } from "https-proxy-agent";
import { env } from "@/env";

export const proxyAgent = new HttpsProxyAgent(env.MY_PROXY_URL);
