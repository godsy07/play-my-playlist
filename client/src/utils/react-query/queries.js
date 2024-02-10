import { useMutation, useQuery } from "@tanstack/react-query";

import {
  checkRoomExists,
  createRoom,
  getAUniqueRoomID,
  joinRoom,
  verifyEmail,
} from "../api/api";

export const useVerifyEmail = ({ user_id, token }) => {
  return useQuery({
    queryKey: ["verifyEmail"],
    queryFn: () => verifyEmail({ user_id, token }),
  });
};

export const useGetAUniqueRoomID = () => {
  return useQuery({
    queryKey: ["getAUniqueRoomID"],
    queryFn: () => getAUniqueRoomID(),
  });
};

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: (data) => createRoom(data),
  });
};

export const useCheckRoomExists = () => {
  return useMutation({
    mutationFn: (data) => checkRoomExists(data),
  });
};

export const useJoinRoom = () => {
  return useMutation({
    mutationFn: (data) => joinRoom(data),
  });
};
