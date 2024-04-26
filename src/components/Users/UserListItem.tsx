import { IUserShortDto } from "@/services/types/users.types";
import Image from "next/image";
import { useMemo } from "react";
import { maskEmail } from "@/utils/helper.util";

interface UsersListsProps {
  user: IUserShortDto;
  onRefreshUsers: () => void;
}

export default function UserListItem(props: UsersListsProps) {
  const { user } = props;

  const isAdmin = useMemo(() => user.role === "admin", [user]);

  console.log({ isAdmin, name: user.name });

  return (
    <div className="relative ml-1 flex justify-between gap-2 rounded-xl bg-violet-100 p-3 shadow-md">
      <div className="flex gap-3">
        <div className="flex grow gap-2">
          <Image
            src={user.picture}
            height={45}
            width={45}
            alt="user_profile"
            className="rounded-full"
          />
          <div className="flex flex-col gap-0.5 text-sm">
            <span className="capitalize">{user.name}</span>
            <span className="text-xs">{maskEmail(user.email)}</span>
          </div>
        </div>
      </div>
      <div
        aria-role={user?.role?.toLowerCase()}
        className="absolute bottom-2 right-4
          text-xs font-medium capitalize
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
