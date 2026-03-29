export default function ProfileView({ user, onSignOut }: { user: any, onSignOut: () => void }) {
  return (
    <div className="p-4 w-full h-full pb-20 flex flex-col items-center pt-10">
      <img 
        src={user?.photoURL || "/assets/placeholder/pc.png"} 
        alt="Profile" 
        className="w-24 h-24 rounded-full border-2 border-[#10b981] object-cover mb-4 shadow-lg shadow-[#10b981]/20"
      />
      <h2 className="text-2xl font-bold text-white">{user?.displayName || "Wibu User"}</h2>
      <p className="text-[#888] text-sm mt-1 mb-8">{user?.email}</p>

      <div className="w-full max-w-sm bg-[#121212] border border-[#1a1a1a] rounded-xl p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
          <span className="text-[#ccc] text-sm">Status Akun</span>
          <span className="text-[#10b981] text-sm font-bold">Aktif (Google)</span>
        </div>
        <div className="flex justify-between items-center pb-1">
          <span className="text-[#ccc] text-sm">Versi Aplikasi</span>
          <span className="text-[#666] text-sm">v0.1.0</span>
        </div>
      </div>

      <button 
        onClick={onSignOut}
        className="mt-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold py-3 px-8 rounded-full transition-colors w-full max-w-sm"
      >
        Keluar Akun
      </button>
    </div>
  );
}
