import React, { useState } from "react";
import { showSnackDanger } from "../utils/functions";
import { APP_URL } from "@env";

const useFetchApi = () => {
  const [fetchApiLoading, setFetchApiLoading] = useState(false);

  const fetchApiCall = async (url, method, headers, data) => {
    try {
      setFetchApiLoading(true);

      const response = await fetch(`${APP_URL}/${url}`, {
        method,
        headers,
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw { status: response.status, data: errorData };
      }

      const responseData = await response.json();
      return { status: response.status, data: responseData };
    } catch (error) {
      showSnackDanger(
        error?.data?.error ||
          error?.data?.message ||
          "Something went wrong, please try again later"
      );
      throw error;
    } finally {
      setFetchApiLoading(false);
    }
  };

  return { fetchApiCall, fetchApiLoading };
};

export default useFetchApi;
