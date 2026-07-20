import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Settings, Key, Check } from 'lucide-react';

interface ChatbotProps {
  language: 'EN' | 'SI';
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

// Knowledge Base for instant local answers
const KNOWLEDGE_BASE_SI: { keywords: (string | string[])[]; response: string }[] = [
  {
    keywords: ['වගා', ['වගා කරන්නේ', 'ක්‍රමය', 'හදන්නේ', 'උපදෙස්', 'මුල සිට']],
    response: `🌱 **හතු වගාව ආරම්භ කිරීමට මූලික පියවර:**\n1. **ස්ථරය සකස් කිරීම:** ලී කුඩු, පිදුරු හෝ කොහුබත් භාවිතයෙන් ස්ථරය (Substrate) සකස් කර තම්බා විෂබීජ හරණය (Pasteurization) කරන්න.\n2. **බීජ දැමීම:** විෂබීජ හරණය කළ ස්ථරයට හතු බීජ (Spawn) එක්කර ප්ලාස්ටික් බෑග් වල අසුරන්න.\n3. **අඳුරු කාමරයේ තැබීම:** බෑග් දින 20-25ක් අඳුරු, වාතාශ්‍රය ඇති ස්ථානයක මයිසීලියම් වර්ධනය වන තෙක් තබන්න.\n4. **අස්වනු නෙලීම:** බෑග් කපා තෙතමනය (85-90%) පවත්වා ගනිමින් දින 3-5කින් අස්වනු නෙලා ගන්න.`
  },
  {
    keywords: ['පුහුණු', ['පාඨමාලා', 'පුහුණුව', 'ඉගෙනගන්න', 'ශ්‍රේණි', 'තරඟ']],
    response: `🎓 **Mushroom Eco Hub පුහුණු පාඨමාලා:**\n- **මූලික හතු වගා පාඨමාලාව:** ආධුනිකයන් සඳහා වගා ක්‍රමවේද.\n- **වාණිජ මට්ටමේ හතු වගාව:** මහා පරිමාණ නිෂ්පාදනය සහ වෙළඳපල සම්බන්ධතා.\n- **හතු බීජ (Spawn) නිෂ්පාදනය:** උසස් තාක්ෂණික බීජ නිපදවීම.\n\n👉 වැඩිදුර විස්තර සඳහා අපගේ **Training Section** වෙත යන්න!`
  },
  {
    keywords: ['යන්ත්‍ර', ['යන්ත්‍ර සූත්‍ර', 'මැෂින්', 'උපකරණ', 'මිල']],
    response: `⚙️ **ලබාගත හැකි යන්ත්‍ර සූත්‍ර සහ උපකරණ:**\n- **තැම්බීමේ බොයිලේරු (Pasteurization Boilers)**\n- **බෑග් ඇසුරුම් යන්ත්‍ර (Bag Filling Machines)**\n- **විජලන යන්ත්‍ර (Mushroom Dehydrators)**\n- **ස්වයංක්‍රීය තෙතමනය පාලක (Automatic Humidity Controllers)**\n\n👉 අපගේ **Machinery Section** වෙත ගොස් ඇණවුම් කළ හැක.`
  },
  {
    keywords: ['මිලදී', ['විකිණීම', 'මිල', 'වෙළඳපොල', 'Marketplace', 'බීජ']],
    response: `🛒 **Marketplace සේවාවන්:**\nඅපගේ Marketplace හරහා ඔබට:\n- නැවුම් ඔයිස්ටර්, බටන් සහ මිල්කි හතු\n- උසස් තත්ත්වයේ හතු බීජ (Mushroom Spawn)\n- වියළි හතු සහ සැකසූ නිෂ්පාදන\nමිලදී ගැනීමට සහ විකිණීමට පහසුකම් ඇත.`
  },
  {
    keywords: ['ලියාපදිංචි', ['එක්වන්න', 'Account', 'ගිණුම', 'රෙජිස්ටර්']],
    response: `🤝 **Mushroom Eco Hub වෙත එක්වීමට:**\n1. ඉහළ ඇති **Sign Up** ක්ලික් කරන්න.\n2. ඔබේ නම, දුරකථන අංකය සහ Email ඇතුළත් කරන්න.\n3. ඔබේ භූමිකාව (ගොවියා, සකසන්නා, යන්ත්‍ර සැපයුම්කරු) තෝරා ගන්න.\n4. සාර්ථකව ලියාපදිංචි වී පරිසර පද්ධතියට එක්වන්න!`
  },
  {
    keywords: ['උෂ්ණත්වය', ['තෙතමනය', 'දේශගුණය', 'පරිසරය']],
    response: `🌡️ **නිසි වගා පරිසර තත්ත්ව:**\n- **උෂ්ණත්වය:** සෙල්සියස් අංශක 25°C - 28°C\n- **සාපේක්ෂ තෙතමනය:** 80% - 90%\n- **වාතාශ්‍රය:** පිරිසිදු නැවුම් වාතය ලැබෙන පරිදි සකස් කරන්න.\n- **ආලෝකය:** ඍජු හිරු එළියෙන් වළකින්න (ක්‍රීම් පැහැති ආලෝකය සුදුසුයි).`
  }
];

const KNOWLEDGE_BASE_EN: { keywords: (string | string[])[]; response: string }[] = [
  {
    keywords: ['grow', ['how to grow', 'steps', 'cultivation', 'guide', 'start']],
    response: `🌱 **Basic Steps for Mushroom Cultivation:**\n1. **Substrate Preparation:** Prepare saw-dust, straw, or coco-peat substrate and pasteurize it.\n2. **Spawning:** Inoculate the pasteurized substrate with high-quality mushroom spawn into plastic bags.\n3. **Incubation:** Keep the bags in a dark, ventilated room for 20-25 days for mycelium run.\n4. **Fruiting & Harvest:** Cut bags open, maintain high humidity (85-90%), and harvest fresh mushrooms in 3-5 days.`
  },
  {
    keywords: ['train', ['training', 'course', 'learn', 'workshop']],
    response: `🎓 **Mushroom Eco Hub Training Programs:**\n- **Basic Cultivation Course:** Ideal for beginners.\n- **Commercial Farming & Marketing:** For large-scale producers.\n- **Spawn Production Technology:** Advanced lab techniques.\n\n👉 Visit our **Training Section** for full details and slot booking!`
  },
  {
    keywords: ['machine', ['machinery', 'equipment', 'steamer', 'dehydrator', 'price']],
    response: `⚙️ **Available Machinery & Equipment:**\n- **Pasteurization Boilers & Steamers**\n- **Substrate Bag Filling Machines**\n- **Mushroom Dehydrators & Dryers**\n- **Automated Mist & Humidity Controllers**\n\n👉 Explore the **Machinery Section** to inspect models and place orders.`
  },
  {
    keywords: ['market', ['buy', 'sell', 'price', 'spawn', 'fresh']],
    response: `🛒 **Marketplace Offerings:**\n- Fresh Oyster, Button, and Milky Mushrooms\n- Certified Lab-Grade Mushroom Spawns\n- Dehydrated Mushrooms & Value-Added Products`
  },
  {
    keywords: ['register', ['join', 'sign up', 'account', 'membership']],
    response: `🤝 **Joining Mushroom Eco Hub:**\n1. Click **Sign Up** in the top navigation.\n2. Fill in your Name, Phone, and Email.\n3. Select your Ecosystem Role (Grower, Processor, Machinery Supplier).\n4. Submit to create your profile!`
  }
];

const DEFAULT_OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export default function Chatbot({ language }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openrouter_api_key') || DEFAULT_OPENROUTER_KEY);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: language === 'EN' 
        ? "Hello! 👋 Welcome to Mushroom Eco Hub AI Assistant. How can I help your mushroom farming journey today?" 
        : "ආයුබෝවන්! 👋 මම හතු පරිසර කේන්ද්‍රයේ AI සහායකයා. ඔබගේ හතු වගා කටයුතු සම්බන්ධයෙන් මා හට උදව් කළ හැක්කේ කෙසේද?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openrouter_api_key', key);
    setShowSettings(false);
  };

  const findLocalAnswer = (query: string): string | null => {
    const qLower = query.toLowerCase();
    const kb = language === 'EN' ? KNOWLEDGE_BASE_EN : KNOWLEDGE_BASE_SI;

    for (const item of kb) {
      for (const kw of item.keywords) {
        if (typeof kw === 'string' && qLower.includes(kw)) {
          return item.response;
        } else if (Array.isArray(kw) && kw.some(sub => qLower.includes(sub))) {
          return item.response;
        }
      }
    }
    return null;
  };

  const fetchAIResponse = async (userPrompt: string): Promise<string> => {
    const activeKey = apiKey || DEFAULT_OPENROUTER_KEY;
    const systemPrompt = `You are the official Mushroom Eco Hub AI Assistant. Answer concisely, politely, and accurately in ${language === 'EN' ? 'English' : 'Sinhala'}. Topic: Mushroom farming, equipment, training, recipes, and Eco Hub services.`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'https://mushroomecohub.com',
        'X-Title': 'Mushroom Eco Hub AI Assistant',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter API Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "Sorry, I could not process that request.";
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(async () => {
      let botReply = '';

      // 1. Try AI response via OpenRouter (GPT-4o-mini)
      try {
        botReply = await fetchAIResponse(query);
      } catch (err: any) {
        console.warn("AI API failed, falling back to local Knowledge Base:", err);
        // Fallback to local knowledge base if offline or API error
        const localAns = findLocalAnswer(query);
        if (localAns) {
          botReply = localAns;
        } else {
          botReply = language === 'EN'
            ? "Thank you for asking! For specific guidance on mushroom farming, training slots, or machinery orders, please explore our site sections or contact support at mushroomecohub@gmail.com."
            : "ස්තූතියි ඔබේ ප්‍රශ්නයට! හතු වගාව, පුහුණු පාඨමාලා හෝ යන්ත්‍ර සූත්‍ර පිළිබඳ වැඩිදුර විස්තර සඳහා අපගේ වෙබ් අඩවියේ අදාළ අංශ වෙත පිවිසෙන්න හෝ mushroomecohub@gmail.com වෙත ඊමේල් කරන්න.";
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const quickChips = language === 'EN' ? [
    "🌱 How to grow mushrooms?",
    "🎓 Available training courses?",
    "⚙️ Machinery & prices",
    "🛒 Marketplace items"
  ] : [
    "🌱 හතු වගා කරන්නේ කෙසේද?",
    "🎓 පුහුණු පාඨමාලා මොනවාද?",
    "⚙️ යන්ත්‍ර සූත්‍ර මිල ගණන්",
    "🛒 Marketplace නිෂ්පාදන"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="chatbot-root">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/40"
          title={language === 'EN' ? "Chat with AI Assistant" : "AI සහායක සමඟ කතාබස් කරන්න"}
          id="chatbot-trigger-btn"
        >
          <Bot className="w-7 h-7 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="w-[90vw] sm:w-[380px] h-[540px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
          id="chatbot-window"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative p-2 bg-white/10 rounded-xl border border-white/20">
                <Bot className="w-6 h-6 text-emerald-200" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-emerald-800 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  {language === 'EN' ? 'Mushroom Eco AI' : 'හතු උපදේශක සහායක'}
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                </h3>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {language === 'EN' ? 'Online • 24/7 Support' : 'ක්‍රියාකාරී • සේවාව සූදානම්'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${showSettings ? 'bg-white/20 text-amber-300' : 'text-white/80'}`}
                title={language === 'EN' ? 'AI Settings (Gemini Key)' : 'AI සැකසුම් (Gemini Key)'}
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80"
                title={language === 'EN' ? 'Close' : 'වසා දමන්න'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Gemini API Key Settings Panel */}
          {showSettings && (
            <div className="bg-emerald-50/90 border-b border-emerald-200 p-3 text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-emerald-900 font-semibold">
                <span className="flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-emerald-600" /> 
                  {language === 'EN' ? 'Google Gemini API Key (Optional)' : 'Google Gemini API Key (විකල්ප)'}
                </span>
                {apiKey && <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-mono">Active</span>}
              </div>
              <p className="text-[11px] text-gray-600 leading-tight">
                {language === 'EN' 
                  ? 'Add your free Gemini API key to enable full generative AI answers.' 
                  : 'නොමිලේ ලබාගත් Gemini API Key එකක් ඇතුළත් කර වඩාත් දියුණු AI පිළිතුරු ලබා ගන්න.'}
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
                <button
                  onClick={() => handleSaveApiKey(apiKey)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded font-medium text-xs transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-emerald-50/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                      : 'bg-white border border-emerald-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-gray-500 italic">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-emerald-100 px-3 py-2 rounded-2xl rounded-bl-none flex items-center space-x-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-white border-t border-emerald-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="flex-shrink-0 text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/60 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-emerald-100 flex items-center gap-2">
            <input
              type="text"
              placeholder={language === 'EN' ? "Type your question here..." : "ඔබේ ප්‍රශ්නය මෙහි ටයිප් කරන්න..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              id="chatbot-input-field"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-colors flex items-center justify-center"
              id="chatbot-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
