import { INetworkFunction } from "@/lib/types";

export const API_URL = import.meta.env.VITE_API_URL || "";

const paramsToUrl = (params: string[]): string => {
  if (params.length === 1) {
    return `/${params[0]}`;
  } else {
    let url = "";
    for (let i = 0; i < params.length; i++) {
      url += `/${params[i]}`;
    }
    return url;
  }
};

const queryToUrl = (query: {
  [key: string]: string | number | boolean | undefined;
}): string => {
  let url = "?";
  for (const key in query) {
    if (query[key] !== undefined) {
      url += `${key}=${query[key]}&`;
    }
  }
  return url.slice(0, -1);
};

export const networkFunctions = async (
  requestConfig: INetworkFunction
): Promise<Response> => {
  const { request, params, query, body, method, headers, credentials } =
    requestConfig;
  const url =
    API_URL +
    request +
    (params ? paramsToUrl(params) : "") +
    (query ? queryToUrl(query) : "");
  const response = await fetch(url, {
    credentials: credentials || "omit",
    method: method || "GET",
    body: body || null,
    headers: headers || {
      "Content-Type": "application/json",
    },
  });
  return response;
};
