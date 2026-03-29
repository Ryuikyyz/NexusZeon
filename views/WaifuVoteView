import { useEffect, useState } from "react";
import { CapacitorHttp } from '@capacitor/core';

export default function WaifuVoteView({ user, onBack }: { user: any, onBack: () => void }) {
  const [waifus, setWaifus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWaifus = async () => {
    try {
      const res = await CapacitorHttp.get({
        url: `https://api.zedxnexus.dpdns.org/api/waifus`,
        headers: { 'x-api-key': 'zedx_rahasia_bismillah_123' }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data && data.success) {
        setWaifus(data.data);
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaifus();
  }, []);

  const handleVote = async (id: number) => {
    if (!user) return alert("Login dulu cuy!");
    try {
      const res = await CapacitorHttp.post({
        url: `https://api.zedxnexus.dpdns.org/api/vote`,
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'zedx_rahasia_bismillah_123' },
        data: { email: user.email, waifu_id: id }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data && data.success) {
        fetchWaifus();
      } else {
        alert("Gagal vote!");
      }
    } catch (e) {}
  };

  return (
    <div className="w-full flex flex-col pb-12 min-h-screen bg-black">
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#1a1a1a] flex items-center p-4 gap-4">
        <button onClick={onBack} className="text-white hover:text-[#10b981] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h2 className="text-xl font-bold text-white">Vote Waifu Terbaik</h2>
      </div>

      <div className="p-4 max-w-2xl mx-auto w-full">
        <p className="text-[#888] text-sm mb-6">Pilih waifu favorit lu. 1 Akun hanya bisa vote 1 kali (vote terakhir yang dihitung).</p>
        
        {loading ? (
          <div className="text-center py-20 text-[#666]">Memuat data Waifu...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {waifus.map((w, idx) => (
              <div key={w.id} className="bg-[#121212] border border-[#1a1a1a] rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4 items-center relative overflow-hidden">
                {idx === 0 && <div className="absolute top-0 right-0 bg-[#f59e0b] text-black text-[9px] font-bold px-3 py-1 rounded-bl-lg">TOP 1</div>}
                
                <div className={`font-bold text-lg sm:text-xl w-6 text-center ${idx === 0 ? 'text-[#f59e0b]' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-700' : 'text-[#666]'}`}>
                  #{idx + 1}
                </div>
                
                <img src={w.link} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#333]" onError={(e: any) => e.target.src='/assets/placeholder/pc.png'} />
                
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm sm:text-base line-clamp-1">{w.nama}</h3>
                  <p className="text-[#888] text-[10px] sm:text-xs line-clamp-1">{w.judul}</p>
                  <p className="text-[#10b981] text-xs sm:text-sm mt-1 font-bold">{w.votes} Votes</p>
                </div>
                
                <button 
                  onClick={() => handleVote(w.id)} 
                  className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/50 px-4 py-2 rounded-full font-bold text-xs hover:bg-[#10b981]/20 transition-colors"
                >
                  VOTE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
