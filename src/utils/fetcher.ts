import { CustomRequest } from "@/types/request";

export const fetcher = async ({
  method = "GET",
  path = "",
  data,
  token,
}: CustomRequest) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  let response;
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token || "",
  };
  if (method === "GET") {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
    });
  } else {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: JSON.stringify(data),
    });
  }

  if (!response.ok) {
    const error = new Error("Error!!!");
    const errorInfo = await response.json();
    throw { ...error, info: errorInfo, status: response.status };
  }

  return response.json();
};
