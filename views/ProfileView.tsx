import { useEffect, useState } from "react";
import { CapacitorHttp } from '@capacitor/core';

const ALL_BORDERS = [
  { id: 'foxbd', name: 'Kitsune Mask' },
  { id: 'none', name: 'Lepas Border' }
];

const ALL_TITLES = [
  { id: 'god', name: 'God', req: 'own' },
  { id: 'demigod', name: 'Demigod', req: 'admin' },
  { id: 'ordinary', name: 'Ordinary Citizens', req: 'all' },
  { id: 'none', name: 'Lepas Gelar', req: 'all' }
];

export default function ProfileView({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  const [role, setRole] = useState("user");
  const [activeBorder, setActiveBorder] = useState("");
  const [activeTitle, setActiveTitle] = useState("");
  const [inventory, setInventory] = useState<string[]>([]);
  
  const [showBorderModal, setShowBorderModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
        setActiveTitle(dataProf.active_title);
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

  const handleSetTitle = async (titleId: string) => {
    const finalTitleId = titleId === 'none' ? '' : titleId;
    setActiveTitle(finalTitleId);
    setShowTitleModal(false);
    try {
      await CapacitorHttp.post({
        url: `https://api.zedxnexus.dpdns.org/api/set-title`,
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'zedx_rahasia_bismillah_123' },
        data: { email: user.email, title_id: finalTitleId }
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
      </div>
      
      <h2 className="text-2xl font-bold text-white flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2">
          {user?.displayName || "Wibu User"}
          {role === 'own' && <img src="/assets/icons/centang.png" alt="Verified" className="w-5 h-5 object-contain" onError={(e: any) => e.target.style.display='none'} />}
          {role === 'admin' && <img src="/assets/icons/centangmr.png" alt="Admin" className="w-5 h-5 object-contain" onError={(e: any) => e.target.style.display='none'} />}
        </div>
        {activeTitle && (
          <img src={`/assets/title/${activeTitle}.png`} className="h-6 mt-1 object-contain" onError={(e: any) => e.target.style.display='none'} />
        )}
      </h2>
      <p className="text-[#888] text-sm mt-1 mb-8">{user?.email}</p>

      <div className="w-full max-w-sm bg-[#121212] border border-[#1a1a1a] rounded-xl p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
          <span className="text-[#ccc] text-sm">Status Akun</span>
          <span className={`text-sm font-bold ${role === 'own' ? 'text-[#3b82f6]' : role === 'admin' ? 'text-red-500' : 'text-[#10b981]'}`}>
            {role === 'own' ? 'Owner / VIP' : role === 'admin' ? 'Administrator' : 'Aktif (Google)'}
          </span>
        </div>
        <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
          <span className="text-[#ccc] text-sm">Bingkai Profile</span>
          <div className="flex items-center gap-3">
            <span className="text-[#10b981] text-sm">{inventory.length} Terbuka</span>
            <button onClick={() => setShowBorderModal(true)} className="bg-[#222] p-1.5 rounded-md border border-[#333] hover:border-[#10b981] transition-colors">
              <img src="/assets/icons/settings.png" className="w-3.5 h-3.5" onError={(e: any) => e.target.style.display='none'} />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center pb-1">
          <span className="text-[#ccc] text-sm">Gelar Profile</span>
          <div className="flex items-center gap-3">
            <span className="text-[#10b981] text-sm">{activeTitle ? ALL_TITLES.find(t=>t.id===activeTitle)?.name : 'Tidak Ada'}</span>
            <button onClick={() => setShowTitleModal(true)} className="bg-[#222] p-1.5 rounded-md border border-[#333] hover:border-[#10b981] transition-colors">
              <img src="/assets/icons/settings.png" className="w-3.5 h-3.5" onError={(e: any) => e.target.style.display='none'} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm mt-8 flex flex-col gap-3">
        <div className="flex gap-3 w-full">
          <button 
            onClick={() => setShowRedeemModal(true)}
            className="flex-1 bg-[#121212] hover:bg-[#1a1a1a] border border-[#333] text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span className="text-xs">Redeem</span>
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className="flex-1 bg-[#121212] hover:bg-[#1a1a1a] border border-[#333] text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span className="text-xs">Kontak</span>
          </button>
        </div>

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

      {showContactModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-safe">
          <div className="bg-[#121212] border-t sm:border border-[#333] rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Hubungi Admin</h3>
              <button onClick={() => setShowContactModal(false)} className="text-[#666] hover:text-white">✕</button>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => window.open("https://t.me/KyysStoreID", "_system")} className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-xl border border-[#333] hover:border-[#10b981] transition-colors w-full text-left group">
                <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Telegram</h4>
                  <p className="text-[#888] text-xs mt-0.5">t.me/KyysStoreID</p>
                </div>
              </button>

              <button onClick={() => window.open("https://whatsapp.com/channel/0029VbBQ5fFJJhzgXbCy9Q05", "_system")} className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-xl border border-[#333] hover:border-[#10b981] transition-colors w-full text-left group">
                <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Saluran WhatsApp</h4>
                  <p className="text-[#888] text-xs mt-0.5">Info & Update Terbaru</p>
                </div>
              </button>

              <button onClick={() => window.open("https://wa.me/6282116501477?text=min+mau+lapor+bug", "_system")} className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-xl border border-[#333] hover:border-[#10b981] transition-colors w-full text-left group">
                <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Lapor Bug</h4>
                  <p className="text-[#888] text-xs mt-0.5">Hubungi Admin (+62821...)</p>
                </div>
              </button>

              <button onClick={() => window.open("https://discord.gg/nWfcJJKUm", "_system")} className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-xl border border-[#333] hover:border-[#10b981] transition-colors w-full text-left group">
                <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11h.01"></path><path d="M15 11h.01"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path><path d="M7.74 15.54A7 7 0 0 1 12 17a7 7 0 0 1 4.26-1.46"></path></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Discord</h4>
                  <p className="text-[#888] text-xs mt-0.5">Gabung Komunitas ZedxPlay</p>
                </div>
              </button>

              <button onClick={() => window.open("mailto:zedxbusiness@outlook.com", "_system")} className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-xl border border-[#333] hover:border-[#10b981] transition-colors w-full text-left group">
                <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Email Business</h4>
                  <p className="text-[#888] text-xs mt-0.5">zedxbusiness@outlook.com</p>
                </div>
              </button>
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

      {showTitleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-safe">
          <div className="bg-[#121212] border-t sm:border border-[#333] rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Pilih Gelar Profile</h3>
              <button onClick={() => setShowTitleModal(false)} className="text-[#666] hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {ALL_TITLES.map(t => {
                const isOwned = t.req === 'all' || (t.req === 'own' && role === 'own') || (t.req === 'admin' && role === 'admin');
                const isActive = (t.id === 'none' && !activeTitle) || activeTitle === t.id;
                
                return (
                  <div 
                    key={t.id} 
                    onClick={() => isOwned && handleSetTitle(t.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${!isOwned ? 'opacity-40 grayscale cursor-not-allowed border-[#1a1a1a]' : isActive ? 'border-[#10b981] bg-[#10b981]/10 cursor-pointer' : 'border-[#333] hover:border-[#666] cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      {t.id !== 'none' ? (
                        <img src={`/assets/title/${t.id}.png`} className="h-8 w-auto object-contain" onError={(e: any) => e.target.style.display='none'} />
                      ) : (
                        <span className="text-white text-sm font-bold ml-2">{t.name}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isOwned && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
                      {isActive && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
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
