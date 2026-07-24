import RegisterForm from "../_components/RegisterForm";




export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-gray-500">
            Join RentNest as a tenant or landlord
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}