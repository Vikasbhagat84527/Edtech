import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>Welcome to MyApp</h1>
      {session ? (
        <p>
          Hello, {session.user?.email}! <a href="/dashboard">Go to Dashboard</a>
        </p>
      ) : (
        <p>
          Hello, Guest! <a href="/auth/login">Login</a> or enjoy exploring the
          website.
        </p>
      )}
    </div>
  );
}
