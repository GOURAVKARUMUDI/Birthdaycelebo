import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to admin login — don't expose any internal slug
  redirect("/admin/login");
}
