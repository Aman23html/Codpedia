import { getDepartments } from "@/actions/departments/get-departments";
import RegisterForm from "@/components/forms/register-form";

export default async function RegisterPage() {
  const departments = await getDepartments();

  return (
    // REMOVED the 'flex items-center p-6' which was breaking your layout
    <main className="min-h-screen w-full bg-[#020813]">
      <RegisterForm departments={departments} />
    </main>
  );
}