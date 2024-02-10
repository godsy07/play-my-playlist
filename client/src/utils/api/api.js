import axios from "axios";
import { BASE_URL } from "../../config/constants";

const apiRequests = async ({
  method = "GET",
  url = "",
  data = {},
  auth = false,
}) => {
  try {
    let reqObj = {
      url,
      method,
      withCredentials: auth,
    };
    if (method === "POST") reqObj.data = data;
    const response = await axios({ ...reqObj });

    if (response.status >= 200 && response.status < 300) {
      return { ...response.data, statusCode: response.status };
    }
  } catch (e) {
    if (e.response) {
      return { ...e.response.data, statusCode: e.response.status };
    } else {
      return {
        statusCode: 500,
        status: false,
        message: "Something went wrong.",
      };
    }
  }
};

export const verifyEmail = async (data) => {
  return await apiRequests({
    method: "POST",
    data,
    url: `${BASE_URL}/playlist/api/user/verify-email`,
  });
};

export const getCurrentUser = async () => {
  return await apiRequests({
    method: "GET",
    auth: true,
    url: `${BASE_URL}/playlist/api/user/get-user-data`,
  });
};

export const getAUniqueRoomID = async () => {
  const response = await apiRequests({
    auth: true,
    method: "GET",
    url: `${BASE_URL}/playlist/api/room/create-roomID`,
  });
  if (response.status) {
    return response.roomID;
  }
  return null;
};

export const createRoom = async (data) => {
  return await apiRequests({
    data,
    auth: true,
    method: "POST",
    url: `${BASE_URL}/playlist/api/room/create-room`,
  });
};

export const checkRoomExists = async (data) => {
  return await apiRequests({
    data,
    auth: true,
    method: "POST",
    url: `${BASE_URL}/playlist/api/room/check-room`,
  });
};

export const joinRoom = async (data) => {
  return await apiRequests({
    data,
    auth: true,
    method: "POST",
    url: `${BASE_URL}/playlist/api/room/join-room`,
  });
};
