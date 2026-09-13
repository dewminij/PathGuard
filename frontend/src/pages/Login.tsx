import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../msalConfig";

function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            PathGuard
          </h1>

          <p className="mt-2 text-gray-500">
            Cybersecurity Monitoring & Incident Response Platform
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
}

export default Login;