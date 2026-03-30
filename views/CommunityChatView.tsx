import { useEffect, useState, useRef } from "react";
import { CapacitorHttp } from '@capacitor/core';

export default function CommunityChatView({ user, onBack }: { user: any, onBack: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await CapacitorHttp.get({
        url: `https://api.zedxnexus.dpdns.org/api/community-chat`,
        headers: { 'x-api-key': 'zedx_rahasia_bismillah_123' }
      });
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data && data.success) {
        setMessages(data.data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setIsSubmitting(true);
    try {
      await CapacitorHttp.post({
        url: `https://api.zedxnexus.dpdns.org/api/community-chat`,
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'zedx_rahasia_bismillah_123'
        },
        data: {
          user_email: user.email || "",
          user_name: user.displayName || "Wibu Anonim",
          user_photo: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'A'}&background=10b981&color=fff`,
          message: newMessage,
          reply_to_id: replyingTo ? replyingTo.id : null
        }
      });
      setNewMessage("");
      setReplyingTo(null);
      fetchMessages();
    } catch (error) {
      alert("Error ngirim pesan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full flex flex-col h-screen bg-[#0b141a]">
      <div className="sticky top-0 z-50 bg-[#202c33] flex items-center p-3 gap-3 shadow-md">
        <button onClick={onBack} className="text-white p-1 hover:bg-[#333] rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-white text-xl">👥</div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">Community Chat</h2>
            <p className="text-[#8696a0] text-xs">Aktivitas Real-time</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-[url('https://i.pinimg.com/originals/8f/ba/cb/8fbacbd464e996966eb9d4a6b7a9c21e.jpg')] bg-cover bg-fixed bg-center bg-blend-overlay bg-black/80">
        {messages.map((m) => {
          const isMe = m.user_email === user?.email;
          const repliedMsg = m.reply_to_id ? messages.find(msg => msg.id === m.reply_to_id) : null;

          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
              <div className={`flex gap-2 max-w-[85%] sm:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className="relative w-8 h-8 flex-shrink-0 mt-auto mb-1 cursor-pointer" onClick={() => setReplyingTo(m)}>
                  <img src={m.user_photo} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-[#202c33]" />
                  {m.active_border && (
                    <img src={`/assets/icons/${m.active_border}.png`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-none pointer-events-none object-contain z-10" onError={(e: any) => e.target.style.display='none'} />
                  )}
                </div>

                <div className={`flex flex-col relative px-3 pt-2 pb-1.5 shadow-sm ${isMe ? 'bg-[#005c4b] rounded-l-xl rounded-tr-xl' : 'bg-[#202c33] rounded-r-xl rounded-tl-xl'}`}>
                  
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className={`text-[12px] font-bold ${m.role === 'own' ? 'text-[#3b82f6]' : m.role === 'admin' ? 'text-red-500' : 'text-[#25D366]'}`}>
                        {m.user_name}
                      </span>
                      {m.role === 'own' && <img src="/assets/icons/centang.png" className="w-3 h-3" onError={(e: any) => e.target.style.display='none'} />}
                      {m.role === 'admin' && <img src="/assets/icons/centangmr.png" className="w-3 h-3" onError={(e: any) => e.target.style.display='none'} />}
                      {m.active_title && <img src={`/assets/title/${m.active_title}.png`} className="h-3 ml-1" onError={(e: any) => e.target.style.display='none'} />}
                    </div>
                  )}

                  {repliedMsg && (
                    <div className="bg-black/20 border-l-4 border-[#25D366] rounded p-2 mb-1.5 text-xs">
                      <span className="font-bold text-[#25D366] block mb-0.5">{repliedMsg.user_name}</span>
                      <span className="text-[#e9edef] line-clamp-2">{repliedMsg.message}</span>
                    </div>
                  )}

                  <div className="flex items-end gap-3 flex-wrap">
                    <span className="text-[#e9edef] text-sm break-words">{m.message}</span>
                    <span className="text-[#8696a0] text-[10px] ml-auto mb-[-2px] shrink-0 mt-1">{formatTime(m.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-1 w-full" />
      </div>

      <div className="bg-[#202c33] p-2 sm:p-3 flex flex-col shadow-[0_-2px_10px_rgba(0,0,0,0.2)] z-50">
        {replyingTo && (
          <div className="bg-[#2a3942] rounded-t-xl p-2 flex justify-between items-start border-l-4 border-[#25D366] mb-2 mx-1">
            <div className="flex flex-col">
              <span className="text-[#25D366] text-xs font-bold mb-1">Membalas {replyingTo.user_name}</span>
              <span className="text-[#8696a0] text-xs line-clamp-1">{replyingTo.message}</span>
            </div>
            <button onClick={() => setReplyingTo(null)} className="text-[#8696a0] p-1">✕</button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={user ? "Ketik pesan..." : "Login dulu cuy..."} 
            className={`flex-1 bg-[#2a3942] text-white text-sm px-4 py-3 outline-none transition-all ${replyingTo ? 'rounded-b-xl rounded-t-sm' : 'rounded-full'}`}
            disabled={isSubmitting || !user}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isSubmitting || !newMessage.trim() || !user}
            className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 transition-colors hover:bg-[#008f6f]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
