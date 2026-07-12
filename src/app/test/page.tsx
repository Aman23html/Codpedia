import { getDepartments } from "@/actions/departments/get-departments";

export default async function TestPage() {
  const departments = await getDepartments();

  return (
    <pre>
      {JSON.stringify(departments, null, 2)}
    </pre>
  );
}