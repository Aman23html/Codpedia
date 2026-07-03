export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-500">
          Unauthorized
        </h1>

        <p className="mt-4 text-slate-400">
          You do not have permission to access
          this page.
        </p>
      </div>
    </div>
  );
}