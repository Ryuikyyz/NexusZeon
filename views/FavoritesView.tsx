import { useEffect, useState } from "react";

export default function FavoritesView({ onOpenDetail }: { onOpenDetail: (id: string) => void }) {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("zedx_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  return (
    <div className="p-4 w-full h-full pb-20">
      <h2 className="text-xl font-bold text-white mb-6">Daftar Suka</h2>
      {favorites.length === 0 ? (
        <div className="text-center text-[#666] py-20 text-sm">Belum ada anime favorit.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favorites.map((item, idx) => (
            <div key={idx} onClick={() => onOpenDetail(item.urlId)} className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group bg-[#121212] border border-[#1a1a1a]">
              <img src={item.coverUrl} alt="Cover" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e:any) => e.target.src="/assets/placeholder/pc.png"} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2 opacity-100">
                <h3 className="text-white text-[11px] font-medium line-clamp-2 drop-shadow-md">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
