import { useState } from "react";

export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const callApi = async (endpoint, options = {}) => {
    const {
      method = "GET",
      body = null,
      queryParams = {},
      headers = {},
    } = options;

    // Get base URL from environment variable
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

    // Construct full URL with base URL
    const fullEndpoint = endpoint.startsWith("http")
      ? endpoint
      : `${baseUrl}${endpoint}`;

    const queryString =
      Object.keys(queryParams).length > 0
        ? "?" + new URLSearchParams(queryParams).toString()
        : "";

    const url = `${fullEndpoint}${queryString}`;

    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && method.toUpperCase() !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, callApi };
}
