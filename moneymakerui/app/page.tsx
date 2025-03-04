import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // Change this to your login page route
  return null; // This prevents rendering anything
}
