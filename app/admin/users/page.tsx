import usersFunctions from "@/services/db/functions/users.functions";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/authOptions";
import UnauthorizedUserLayout from "@/components/Layouts/UnathorizedUserLayout";

const UsersLists = dynamic(() => import("@/components/Users/UsersLists"), {
  ssr: false,
});

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  const isSuperAdmin = await usersFunctions.isUserSuperAdmin(
    session?.user?.email || "--",
  );

  if (!isSuperAdmin) {
    return <UnauthorizedUserLayout />;
  }

  return <UsersLists />;
}
