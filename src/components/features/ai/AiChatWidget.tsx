import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, RefreshCw } from 'lucide-react';
import { aiApi, type ChatRequest } from '@/services/aiService';
import { useAuthStore } from '@/stores/useAuthStore';
import aiAvatar from '@/assets/ai.png';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isStreaming?: boolean;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>(() => self.crypto.randomUUID());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 현재 사용자 UUID 가져오기 (없으면 임시 생성 - 데모용)
  // 실제 환경에서는 백엔드나 토큰에서 올바른 UUID를 가져와야 합니다.
  const { user } = useAuthStore();
  const [guestUuid] = useState(() => self.crypto.randomUUID()); 
  const userUuid = user ? String(user.id) : guestUuid;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleRefreshChat = () => {
    // 대화 초기화 (새로운 conversationId 발급)
    setMessages([]);
    setConversationId(self.crypto.randomUUID());
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Handle initial conversationId fallback if needed, or assume it exists
    const currentInput = input.trim();
    setInput('');
    
    const userMessageId = Date.now().toString();
    const aiMessageId = (Date.now() + 1).toString();
    
    // Add User Message
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: currentInput,
    };

    // Add Initial AI Placeholder
    const initialAiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'ai',
      content: '',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, initialAiMessage]);

    const request: ChatRequest = {
      // NOTE: aiApi.tsx expects conversationId to be string | null
      conversationId,
      userUuid,
      message: currentInput,
    };

    let accumulatedAnswer = '';

    await aiApi.chatStream(
      request,
      (chunk) => {
          accumulatedAnswer += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, content: accumulatedAnswer } : msg
          ));
      },
      (error) => {
          console.error('Chat error:', error);
          const errorMessage = error instanceof Error && error.message.includes('401')
            ? '로그인이 필요한 서비스입니다.'
            : '문제가 생겼어요. 다시 시도해 주세요.';
            
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId
              ? { ...msg, content: accumulatedAnswer + `\n\n[${errorMessage}]`, isStreaming: false } 
              : msg
          ));
      },
      () => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
          ));
      }
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 채팅 창 */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col border border-neutral-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* 헤더 */}
          <div className="bg-primary-500 p-4 text-white flex justify-between items-center shrink-0">
            <div>
              <h3 className="font-bold">AI 덕쿠 상담사</h3>
              <p className="text-xs text-primary-100 mt-1">개인 맞춤화된 상품을 추천받아보세요!</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleRefreshChat}
                className="p-1 hover:bg-primary-600 rounded-full transition-colors"
                title="새로운 대화 시작"
              >
                <RefreshCw size={18} />
              </button>
              <button 
                onClick={toggleChat}
                className="p-1 hover:bg-primary-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* 메시지 목록 (GPT 스타일) */}
          <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-sm">
                <img src={aiAvatar} alt="AI Avatar" className="w-16 h-16 mb-4 opacity-50 grayscale" />
                <p>개인 맞춤화된 상품을 추천받아보세요!</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mr-2 bg-neutral-100 border border-neutral-200">
                      <img src={aiAvatar} alt="AI Avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary-500 text-white rounded-br-none' 
                      : 'bg-neutral-100 text-neutral-800 rounded-bl-none'
                  }`}>
                    {msg.role === 'ai' ? (
                      <>
                        {msg.content || (msg.isStreaming ? <span className="animate-pulse">답변을 생각하는 중...</span> : '')}
                        {msg.isStreaming && msg.content && <span className="inline-block w-1.5 h-3.5 ml-1 bg-neutral-400 animate-pulse align-middle" />}
                      </>
                    ) : (
                      <>{msg.content}</>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 창 */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-neutral-200 shrink-0">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="어떤 것이 궁금하신가요?"
                className="w-full bg-neutral-100 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 p-1.5 bg-primary-500 text-white rounded-full disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
              >
                <Send size={16} className="-ml-0.5 mt-0.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg flex items-center justify-center hover:bg-primary-600 hover:scale-105 transition-all duration-200 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
