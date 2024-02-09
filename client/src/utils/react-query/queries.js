import { useQuery } from "@tanstack/react-query";

import { verifyEmail } from "../api/api";

export const useVerifyEmail = ({ user_id, token }) => {
  return useQuery({
    queryKey: ["verifyEmail"],
    queryFn: () => verifyEmail({ user_id, token }),
  });
};
