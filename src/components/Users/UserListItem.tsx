import { IUserShortDto } from "@/services/types/users.types";

interface UsersListsProps {
  user: IUserShortDto;
}

export default function UserListItem(props: UsersListsProps) {
  const { user } = props;
  return (
    <div>
      <div>UsersLists..</div>
    </div>
  );
}
