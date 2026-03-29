export default function ActivityView({ onOpenWaifuVote }: { onOpenWaifuVote: () => void }) {
  return (
    <div className="p-4 w-full h-full pb-20 pt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Aktivitas & Event</h2>
      
      <div className="flex flex-col gap-4">
        <div 
          onClick={onOpenWaifuVote} 
          className="bg-[#121212] border border-[#1a1a1a] rounded-xl p-4 flex gap-4 items-center cursor-pointer hover:bg-[#1a1a1a] transition-all group"
        >
          <div className="w-16 h-16 bg-[#10b981]/10 rounded-xl flex items-center justify-center border border-[#10b981]/20 group-hover:scale-105 transition-transform">
            <span className="text-3xl">👑</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">Voting Waifu Terbaik</h3>
            <p className="text-[#888] text-xs mt-1 leading-relaxed">Pilih waifu favorit lu dari daftar. Yang paling banyak vote bakal jadi TOP 1!</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#10b981] transition-colors"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    </div>
  );
}
