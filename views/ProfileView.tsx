import { useEffect, useState } from "react";
import { CapacitorHttp } from '@capacitor/core';

export default function ProfileView({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  const [role, setRole] = useState("user");

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user?.email) return;
      try {
        const res = await CapacitorHttp.get({
          url: `http://165.22.253.30:8010/api/badges`
        });
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        if (data && data.success) {
          if (data.data.own.includes(user.email)) setRole("own");
          else if (data.data.admin.includes(user.email)) setRole("admin");
        }
      } catch (e) {}
    };
    fetchBadges();
  }, [user]);

  const openSaweria = () => {
    window.open("https://saweria.co/DemonzGhizer", "_system");
  };

  return (
    <div className="p-4 w-full h-full pb-20 flex flex-col items-center pt-10">
      <div className="relative mb-4">
        <img 
          src={user?.photoURL || "/assets/placeholder/pc.png"} 
          alt="Profile" 
          className={`w-24 h-24 rounded-full border-2 object-cover shadow-lg ${role === 'own' ? 'border-[#3b82f6] shadow-[#3b82f6]/20' : role === 'admin' ? 'border-red-500 shadow-red-500/20' : 'border-[#10b981] shadow-[#10b981]/20'}`}
        />
        {role === 'own' && <img src="/assets/icons/centang.png" className="absolute bottom-0 right-0 w-7 h-7 bg-[#121212] rounded-full p-1 border border-[#333]" onError={(e: any) => e.target.style.display='none'} />}
        {role === 'admin' && <img src="/assets/icons/centangmr.png" className="absolute bottom-0 right-0 w-7 h-7 bg-[#121212] rounded-full p-1 border border-[#333]" onError={(e: any) => e.target.style.display='none'} />}
      </div>
      
      <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
        {user?.displayName || "Wibu User"}
        {role === 'own' && <img src="/assets/icons/centang.png" alt="Verified" className="w-5 h-5 object-contain" onError={(e: any) => e.target.style.display='none'} />}
        {role === 'admin' && <img src="/assets/icons/centangmr.png" alt="Admin" className="w-5 h-5 object-contain" onError={(e: any) => e.target.style.display='none'} />}
      </h2>
      <p className="text-[#888] text-sm mt-1 mb-8">{user?.email}</p>

      <div className="w-full max-w-sm bg-[#121212] border border-[#1a1a1a] rounded-xl p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
          <span className="text-[#ccc] text-sm">Status Akun</span>
          <span className={`text-sm font-bold ${role === 'own' ? 'text-[#3b82f6]' : role === 'admin' ? 'text-red-500' : 'text-[#10b981]'}`}>
            {role === 'own' ? 'Owner / VIP' : role === 'admin' ? 'Administrator' : 'Aktif (Google)'}
          </span>
        </div>
        <div className="flex justify-between items-center pb-1">
          <span className="text-[#ccc] text-sm">Versi Aplikasi</span>
          <span className="text-[#666] text-sm">v0.1.0</span>
        </div>
      </div>

      <div className="w-full max-w-sm mt-8 flex flex-col gap-3">
        <button 
          onClick={openSaweria}
          className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 px-8 rounded-full transition-colors w-full flex items-center justify-center gap-2 shadow-lg shadow-[#f59e0b]/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          Dukung via Saweria
        </button>
        <button 
          onClick={onSignOut}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold py-3 px-8 rounded-full transition-colors w-full"
        >
          Keluar Akun
        </button>
      </div>
    </div>
  );
}
