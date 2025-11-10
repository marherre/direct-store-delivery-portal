import { getTranslations } from 'next-intl/server';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100/40 to-blue-200/50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/25 animate-gradient-shift"></div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Large animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/15 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-float-reverse"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-300/15 rounded-full blur-lg animate-float-slow"></div>
        
        {/* Geometric triangles */}
        <div className="absolute top-40 right-32 w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-blue-400/10 blur-lg animate-spin-slow"></div>
        <div className="absolute bottom-40 left-32 w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-t-[120px] border-t-blue-500/10 blur-xl animate-spin-reverse"></div>
        
        {/* Squares rotated */}
        <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-blue-400/10 rotate-45 blur-md animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-blue-500/10 rotate-45 blur-md animate-float-reverse"></div>
      </div>

      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1">
                <animate attributeName="stop-opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1">
                <animate attributeName="stop-opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q400,100 800,200 T1600,200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-draw-line"
          />
          <path
            d="M0,400 Q400,300 800,400 T1600,400"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-draw-line-reverse"
          />
        </svg>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-orange-400/60 p-8 sm:p-10 relative overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/60 via-transparent to-orange-100/40 pointer-events-none animate-border-glow"></div>
          
          {/* Inner glow effect with orange */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 via-orange-500/20 to-orange-400/20 rounded-3xl blur-xl opacity-50 animate-pulse-slow -z-10"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 mb-5 shadow-lg shadow-blue-500/40 transform hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-2 animate-gradient-text">
              {t('adminPortal')}
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              {t('signInToAccount')}
            </p>
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}

