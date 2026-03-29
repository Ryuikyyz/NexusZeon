import { useEffect, useState } from "react";

export default function HistoryView({ onOpenStream }: { onOpenStream: (id: string) => void }) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("zedx_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("zedx_history");
    setHistory([]);
  };

  return (
    <div className="p-4 w-full h-full pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Riwayat Nonton</h2>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-400">Hapus Semua</button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center text-[#666] py-20 text-sm">Belum ada riwayat tontonan.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item, idx) => (
            <div key={idx} onClick={() => onOpenStream(item.chapterUrlId)} className="flex gap-4 items-center bg-[#121212] p-3 rounded-lg border border-[#1a1a1a] cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <img src={item.coverUrl} alt="Cover" className="w-20 h-14 object-cover rounded" onError={(e:any) => e.target.src="/assets/placeholder/pc.png"} />
              <div className="flex-1">
                <h3 className="text-white text-sm font-medium line-clamp-2">{item.title}</h3>
                <p className="text-[#666] text-[10px] mt-1">{new Date(item.timestamp).toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
