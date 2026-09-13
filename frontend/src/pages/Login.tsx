import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../msalConfig";


function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* Outer Card with subtle blue border matching reference */}
      <div className="w-full max-w-xl bg-white rounded-3xl border-2 border-blue-300/80 shadow-2xl shadow-blue-500/10 p-12 sm:p-16 flex flex-col items-center">
        
        {/* Brand Banner */}
        <div className="w-full flex justify-center mb-6">
          <img 
            src="/pathguardlogo.png" 
            alt="PathGuard - Attack Path Correlation & Risk Prioritization" 
            className="w-full max-w-[320px] object-contain"
          />
        </div>

        {/* Secure Section Header */}
        <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5"
          >
            <path 
              fillRule="evenodd" 
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>Secure Login</span>
        </div>

        <p className="text-sm text-slate-500 mb-8 text-center">
          Sign in to access your SOC Dashboard
        </p>

        {/* Microsoft Entra ID Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all duration-150 ease-in-out flex items-center justify-center gap-3 cursor-pointer"
        >
          {/* Microsoft 4-Color Grid Logo */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 21 21">
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
          <span>Sign in with Microsoft Entra ID</span>
        </button>

        {/* Security / Identity Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 w-full text-center">
          <p className="text-xs text-slate-400">
            Enterprise Single Sign-On • Multi-Factor Authentication Enforced
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;