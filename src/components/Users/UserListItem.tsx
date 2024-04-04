import { IUserShortDto } from "@/services/types/users.types";
import Image from "next/image";
import { useContext, useMemo, useState } from "react";
import { TWButton } from "../UI/Button";
import { SnackContext } from "@/context/snack.context";
import userRequests from "@/services/request/users.request";
import { maskEmail } from "@/utils/helper.util";

interface UsersListsProps {
  user: IUserShortDto;
  onRefreshUsers: () => void;
}

export default function UserListItem(props: UsersListsProps) {
  const { user, onRefreshUsers = () => {} } = props;
  const [processing, setProcessing] = useState(false);
  const { showSnack } = useContext(SnackContext);

  const handleSwitchToAdmin = async (userId: string, role: string) => {
    setProcessing(true);
    try {
      const data = await userRequests.switchUserRole(userId, role);
      if (data && data.status) {
        showSnack("User role has switched.", "success");
        onRefreshUsers();
      }
      // TODO: Call api to switch user to admin
    } catch (err) {
      console.log("ERROR handle switching admin::", err);
      showSnack("Failed to switch role. Please try again later.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const isAdmin = useMemo(() => user.role === "admin", [user]);

  console.log({ isAdmin, name: user.name });

  return (
    <div className="bg-violet-100 p-3 flex gap-2 rounded-xl ml-1 justify-between shadow-md relative">
      <div className="flex gap-3">
        <div className="grow flex gap-2">
          <Image
            src={user.picture}
            height={45}
            width={45}
            alt="user_profile"
            className="rounded-full"
          />
          <div className="text-sm flex flex-col gap-0.5">
            <span className="capitalize">{user.name}</span>
            <span className="text-xs">{maskEmail(user.email)}</span>
          </div>
        </div>
      </div>
      <div
        aria-role={user?.role?.toLowerCase()}
        className="capitalize text-xs font-medium
          absolute bottom-2 right-4
          aria-[role=admin]:text-violet-500
          aria-[role=user]:text-pink-500"
      >
        {/* <TWButton
          loading={processing}
          variant={isAdmin ? "primary" : "secondary"}
          className={`group-hover:visible py-1 px-2 text-xs`}
          onClick={() =>
            handleSwitchToAdmin(user._id, isAdmin ? "user" : "admin")
          }
        >
          {isAdmin ? "Revoke admin" : "Switch to Admin"}
        </TWButton> */}
      </div>
    </div>
  );
}
