
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const ShiftAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'สวัสดีค่ะ พยาบาลมาลี! ฉันคือผู้ช่วยจัดการเวรของคุณ วันนี้มีอะไรให้ฉันช่วยไหมคะ? ฉันสามารถช่วยร่างข้อความขอแลกเวรหรืออธิบายระเบียบการของโรงพยาบาลได้ค่ะ' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Fix: Use the required initialization pattern and model name from guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'คุณคือ AI ผู้ช่วยจัดการเวรของโรงพยาบาลเทพสตรี (Thepsatri Hospital) คุณทำหน้าที่ช่วยเหลือพยาบาลในการจัดการตารางงาน ร่างข้อความขอแลกเวรกับเพื่อนร่วมงานอย่างสุภาพ และสรุประเบียบการปฏิบัติงาน โปรดใช้โทนเสียงที่เป็นมืออาชีพ มีความเห็นอกเห็นใจ และสนับสนุนการทำงานของพยาบาล โดยสื่อสารเป็นภาษาไทยทั้งหมด',
          temperature: 1, // Guideline recommendation for creative/helpful tasks
        }
      });

      const assistantContent = response.text || "ขออภัยค่ะ ฉันไม่สามารถประมวลผลคำขอนี้ได้ในขณะนี้";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "ข้อผิดพลาด: ไม่สามารถเชื่อมต่อกับบริการ AI ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <span className="material-symbols-outlined fill">{isOpen ? 'close' : 'smart_toy'}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[500px] bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">support_agent</span>
              <span className="font-bold">ผู้ช่วยจัดการเวร</span>
            </div>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-white/10 text-text-main dark:text-white rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-white/10 p-3 rounded-2xl rounded-tl-none animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="พิมพ์คำถามของคุณที่นี่..."
                className="flex-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                type="submit"
                className="bg-primary text-white p-2 rounded-full hover:bg-pink-600 transition-colors"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ShiftAssistant;
