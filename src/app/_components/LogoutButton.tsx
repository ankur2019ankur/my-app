import { logout } from "../actions/auth";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="text-blue-600 hover:text-blue-600 cursor-pointer">
        Logout
      </button>
    </form>
  );
}