import { IUserData } from "@/lib/types";
import { getAllUsers } from "../_actions/getAllUsers";
import { UsersTable } from "./UsersTable";

export async function UsersList() {
  const result = await getAllUsers();

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No users found.
      </p>
    );
  }

  return <UsersTable users={result.data} />;
}