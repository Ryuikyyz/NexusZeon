export default function BottomNav({ active, onChange }: { active: string, onChange: (val: string) => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] flex justify-around items-center h-16 z-40 pb-safe px-2">
      <button onClick={() => onChange("home")} className={`flex flex-col items-center gap-1 w-12 ${active === "home" ? "text-[#10b981]" : "text-[#666] hover:text-[#888]"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button onClick={() => onChange("activity")} className={`flex flex-col items-center gap-1 w-12 ${active === "activity" ? "text-[#10b981]" : "text-[#666] hover:text-[#888]"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span className="text-[10px] font-medium">Activity</span>
      </button>
      <button onClick={() => onChange("history")} className={`flex flex-col items-center gap-1 w-12 ${active === "history" ? "text-[#10b981]" : "text-[#666] hover:text-[#888]"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span className="text-[10px] font-medium">Riwayat</span>
      </button>
      <button onClick={() => onChange("favorites")} className={`flex flex-col items-center gap-1 w-12 ${active === "favorites" ? "text-[#10b981]" : "text-[#666] hover:text-[#888]"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <span className="text-[10px] font-medium">Suka</span>
      </button>
      <button onClick={() => onChange("profile")} className={`flex flex-col items-center gap-1 w-12 ${active === "profile" ? "text-[#10b981]" : "text-[#666] hover:text-[#888]"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );
}
