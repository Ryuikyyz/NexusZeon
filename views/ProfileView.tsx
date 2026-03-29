import { useEffect, useState } from "react";
import { CapacitorHttp } from '@capacitor/core';

const ALL_BORDERS = [
  { id: 'foxbd', name: 'Kitsune Mask' },
  { id: 'none', name: 'Lepas Border' }
];

export default function ProfileView({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  const [role, setRole] = useState("user");
  const [activeBorder, setActiveBorder] = useState("");
  const [inventory, setInventory] = useState<string[]>([]);
  
  const [showBorderModal, setShowBorderModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemMsg, setRedeemMsg] = useState("");

  const fetchData = async () => {
    if (!user?.email) return;
    try {
      const resRole = await CapacitorHttp.get({
        url: `https://api.zedxnexus.dpdns.org/api/badges`,
        headers: { 'x-api-key': 'zedx_rahasia_bismillah_123' }
      });
      const dataRole = typeof resRole.data === 'string' ? JSON.parse(resRole.data) : resRole.data;
      if (dataRole && dataRole.success) {
        if (dataRole.data.own.includes(user.email)) setRole("own");
        else if (dataRole.data.admin.includes(user.email)) setRole("admin");
      }

      const resProf = await CapacitorHttp.get({
        url: `https://api.zedxnexus.dpdns.org/api/profile/${user.email}`,
        headers: { 'x-api-key': 'zedx_rahasia_bismillah_123' }
      });
      const dataProf = typeof resProf.data === 'string' ? JSON.parse(resProf.data) : resProf.data;
      if (dataProf && dataProf.success) {
        setActiveBorder(dataProf.active_border);
        setInventory(dataProf.inventory || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRedeem = async () => {
    if (!redeemCode.trim() || !user?.email) return;
    setRedeemMsg("Mengecek kode...");
    try {
      const res = await CapacitorHttp.post({
        url: `https://api.zedxnexus.dpdns.org/api/redeem`,
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'zedx_rahasia_bismillah_123' },
        data: { email: user.email, code: redeemCode }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      setRedeemMsg(data.message || "Gagal");
      if (data.success) {
        fetchData();
        setTimeout(() => setShowRedeemModal(false), 2000);
      }
    } catch (e) {
      setRedeemMsg("Error jaringan.");
    }
  };

  const handleSetBorder = async (borderId: string) => {
    if (borderId !== 'none' && !inventory.includes(borderId)) return;
    
    const finalBorderId = borderId === 'none' ? '' : borderId;
    setActiveBorder(finalBorderId);
    setShowBorderModal(false);

    try {
      await CapacitorHttp.post({
        url: `https://api.zedxnexus.dpdns.org/api/set-border`,
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'zedx_rahasia_bismillah_123' },
        data: { email: user.email, border_id: finalBorderId }
      });
    } catch (e) {}
  };

  return (
    <div className="p-4 w-full h-full pb-20 flex flex-col items-center pt-10 relative">
      <div className="relative mb-4 w-24 h-24">
        <img 
          src={user?.photoURL || "/assets/placeholder/pc.png"} 
          alt="Profile" 
          className={`w-24 h-24 rounded-full border-2 object-cover shadow-lg ${role === 'own' ? 'border-[#3b82f6] shadow-[#3b82f6]/20' : role === 'admin' ? 'border-red-500 shadow-red-500/20' : 'border-[#10b981] shadow-[#10b981]/20'}`}
        />
        {activeBorder && (
          <img src={`/assets/icons/${activeBorder}.png`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none pointer-events-none object-contain z-10" onError={(e: any) => e.target.style.display='none'} />
        )}
        
        {role === 'own' && <img src="/assets/icons/centang.png" className="absolute bottom-0 right-0 w-7 h-7 bg-[#121212] rounded-full p-1 border border-[#333] z-20" onError={(e: any) => e.target.style.display='none'} />}
        {role === 'admin' && <img src="/assets/icons/centangmr.png" className="absolute bottom-0 right-0 w-7 h-7 bg-[#121212] rounded-full p-1 border border-[#333] z-20" onError={(e: any) => e.target.style.display='none'} />}
        
        <button onClick={() => setShowBorderModal(true)} className="absolute bottom-0 left-0 bg-[#121212] p-1.5 rounded-full border border-[#333] hover:bg-[#222] transition-colors z-20">
          <img src="/assets/icons/settings.png" className="w-4 h-4" onError={(e: any) => e.target.style.display='none'} />
        </button>
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
          <span className="text-[#ccc] text-sm">Bingkai Profile</span>
          <span className="text-[#10b981] text-sm">{inventory.length} Terbuka</span>
        </div>
      </div>

      <div className="w-full max-w-sm mt-8 flex flex-col gap-3">
        <button 
          onClick={() => setShowRedeemModal(true)}
          className="bg-[#121212] hover:bg-[#1a1a1a] border border-[#333] text-white font-bold py-3 px-8 rounded-full transition-colors w-full flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Redeem Code
        </button>
        <button 
          onClick={() => window.open("https://saweria.co/DemonzGhizer", "_system")}
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

      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-white font-bold text-lg mb-4">Redeem Code</h3>
            <input 
              type="text" 
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              placeholder="Masukkan kode..." 
              className="w-full bg-[#0a0a0a] border border-[#333] focus:border-[#10b981] text-white p-3 rounded-lg mb-2 outline-none"
            />
            {redeemMsg && <p className="text-[#10b981] text-xs mb-4">{redeemMsg}</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowRedeemModal(false); setRedeemMsg(""); setRedeemCode(""); }} className="flex-1 bg-[#1a1a1a] text-white font-bold py-2 rounded-lg">Batal</button>
              <button onClick={handleRedeem} className="flex-1 bg-[#10b981] text-white font-bold py-2 rounded-lg">Klaim</button>
            </div>
          </div>
        </div>
      )}

      {showBorderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-safe">
          <div className="bg-[#121212] border-t sm:border border-[#333] rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Pilih Bingkai Profile</h3>
              <button onClick={() => setShowBorderModal(false)} className="text-[#666] hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {ALL_BORDERS.map(b => {
                const isOwned = b.id === 'none' || inventory.includes(b.id);
                const isActive = (b.id === 'none' && !activeBorder) || activeBorder === b.id;
                
                return (
                  <div 
                    key={b.id} 
                    onClick={() => handleSetBorder(b.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors ${!isOwned ? 'opacity-50 grayscale cursor-not-allowed border-[#1a1a1a]' : isActive ? 'border-[#10b981] bg-[#10b981]/10 cursor-pointer' : 'border-[#333] hover:border-[#666] cursor-pointer'}`}
                  >
                    <div className="w-12 h-12 relative flex items-center justify-center bg-[#0a0a0a] rounded-full">
                      {b.id !== 'none' ? (
                        <img src={`/assets/icons/${b.id}.png`} className="w-16 h-16 max-w-none object-contain" onError={(e: any) => e.target.style.display='none'} />
                      ) : (
                        <span className="text-[#666] text-xs">Kosong</span>
                      )}
                      {!isOwned && (
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] text-center ${isActive ? 'text-[#10b981] font-bold' : 'text-[#888]'}`}>{b.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
