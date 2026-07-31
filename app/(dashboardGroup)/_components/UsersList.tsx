import { IUserData } from "@/lib/types";
import { getAllUsers } from "../_actions/getAllUsers";
import { UserRow } from "./UserRow";

export async function UsersList() {
  const result = await getAllUsers();

  if (!result.success || !result.data?.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No users found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {result.data.map((user: IUserData) => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  );
}