import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";


import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { setCurrentChatId } from "../chat.slice";


const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const chat = useChat();
  const dispatch = useDispatch();

  

  let chats = useSelector((state) => state.chat.chats);
  let currentChatId = useSelector((state) => state.chat.currentChatId);
  
  console.log(chats[currentChatId]);
  console.log(chats)
  console.log(Object.values(chats));

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTyping(true);
    await chat.handleSendMessage({ message: input, chatId: currentChatId });

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { text: chats.content, sender: chats.role },
      ]);
    }, 1200);

    console.log("Chating: ",chats);
  };
  


  const openChat = (chatId)=>{
    console.log("Chat", chatId);
    chat.handleOpenChat(chatId, chats);
  }

  function hanleClearChat(){
    dispatch(setCurrentChatId(null));
    setActiveChat(null);
  }

  return (
    <main className="flex h-screen w-full bg-gradient-to-br from-[#050505] via-[#0d0d0d] to-[#1a0000] text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-[260px] bg-[#0f0f0f]/90 backdrop-blur-xl p-4 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h1 className="text-2xl font-bold text-red-500 mb-6">Proplexity</h1>

        {/* Improved New Chat Button */}
        <button onClick={hanleClearChat} className="w-full mb-5 mt-20 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 hover:scale-[1.04] active:scale-[0.98] transition shadow-lg font-medium tracking-wide">
          + New Chat
        </button>

        <div className="text-sm mb-2 text-gray-500">Chat History</div>
        <div className="space-y-1 overflow-y-auto">
          {Object.values(chats).map((chat, i) => (
            <div
              key={i}
              onClick={() => {
                setActiveChat(chat.title);
                setSidebarOpen(false);
                openChat(chat.id);
              }}
              className={`px-4 py-2 rounded-xl cursor-pointer transition-all
                ${
                  activeChat === chat.id
                    ? "bg-red-500/20 shadow-md"
                    : "hover:bg-white/5"
                }`}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Main */}
      <section className="flex-1 flex flex-col">
        {/* Improved Header */}
        <div className="flex items-center gap-3 px-3 md:px-6 py-3 bg-[#0f0f0f]/80 backdrop-blur-xl shadow-sm">
          {/* Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white text-2xl px-2 py-1 rounded-lg hover:bg-white/10 transition"
          >
            ☰
          </button>

          {/* Chat Title */}
          <div className="flex-1">
            <h2 className="text-sm md:text-lg font-medium text-gray-200 truncate">
              {activeChat}
            </h2>
          </div>

          {/* User Badge */}
          <div className="hidden sm:block px-3 md:px-4 py-1 rounded-full bg-white/5 text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
            {user?.username}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4 no-scroll">
          {!currentChatId && (
            <div className="text-center text-gray-500 mt-20 text-sm md:text-base">
              Start chatting with AI 🚀
            </div>
          )}

          {chats[currentChatId]?.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] md:max-w-[60%] px-4 py-2 rounded-2xl shadow-lg text-sm md:text-base
    ${
      msg.role === "user"
        ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
        : " backdrop-blur-md text-gray-200"
    }`}
              >
                {msg.role === "ai" ? (
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-white/5 text-gray-400 text-sm animate-pulse">
                AI is typing...
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-3 md:p-4 bg-[#0f0f0f]/70 backdrop-blur-xl">
          <div className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-[#141414] to-[#1a1a1a] rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-lg focus-within:ring-2 focus-within:ring-red-500/40 transition-all">
            {/* Input Field */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              type="text"
              placeholder="Ask anything..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm md:text-base"
            />

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 active:scale-95 px-4 md:px-5 py-2 rounded-xl text-sm md:text-base font-medium transition-all shadow-md"
            >
              ➤ <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;


