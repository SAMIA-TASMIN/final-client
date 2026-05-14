import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: roleData = { role: "citizen" } } =
    useQuery({
      queryKey: ["user-role", user?.email],
      queryFn: async () => {
        if (!user?.email) return { role: "citizen" };
        const res = await axiosSecure.get(`/users/${user.email}/role`);
        
        return res.data?.role ? res.data : { role: "citizen" };
      },
      enabled: !!user?.email,
    });
    console.log(user)

  const role = roleData.role;
  console.log("User role:", role);

  return { role, roleLoading };
};

export default useRole;
