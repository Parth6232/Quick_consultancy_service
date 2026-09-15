import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../../utils/iconMap.jsx'
import chatbotIcon from '../../assets/chatbot-icon.png'
import { toggleChat, setLanguage, addMessage } from '../../store/redux/slices/chatSlice.js'
import { useDraggableWidget } from '../../common/useDraggableWidget.js'
import { useSendChatMessageMutation } from '../../store/redux/apiSlice'

// Each quick reply carries a fixed English "intent" query (sent to the AI so it
// always understands the question) plus a bilingual label shown on the button.
const QUICK_REPLIES = [
  { id: 'services', en: 'Our Services', hi: 'हमारी सेवाएं', query: 'What services do you offer?' },
  { id: 'quote', en: 'Get a Quote', hi: 'कोटेशन लें', query: 'How can I get a quote?' },
  { id: 'contact', en: 'Contact Us', hi: 'संपर्क करें', query: 'How can I contact you?' },
]

const TypingDots = () => (
  <div className="max-w-[85%] px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 self-start flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
)

const ChatWidgetContainer = () => {
  const dispatch = useDispatch()
  const { open, language, messages } = useSelector((s) => s.chat)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const widgetRef = useRef(null)
  const scrollRef = useRef(null)
  const { style: dragStyle, onPointerDown, hasMoved } = useDraggableWidget(widgetRef)
  const [sendChatMessage] = useSendChatMessageMutation()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleToggleClick = () => {
    // don't toggle open/close if the pointerdown turned into a drag
    if (hasMoved()) return
    dispatch(toggleChat())
  }

  const askBot = async (queryText) => {
    setIsTyping(true)
    try {
      const result = await sendChatMessage({ message: queryText, lang: language }).unwrap()
      dispatch(addMessage({ id: `bot-${Date.now()}`, sender: 'bot', text: result.reply }))
    } catch (err) {
      const fallback =
        language === 'hi'
          ? 'माफ़ करें, अभी जवाब नहीं दे पा रहे। कृपया WhatsApp पर +91 81091 01811 पर संपर्क करें।'
          : err?.data?.message || "Sorry, I couldn't respond right now. Please reach us on WhatsApp at +91 81091 01811."
      dispatch(addMessage({ id: `bot-err-${Date.now()}`, sender: 'bot', text: fallback }))
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (qr) => {
    const label = language === 'hi' ? qr.hi : qr.en
    dispatch(addMessage({ id: `${qr.id}-${Date.now()}`, sender: 'user', text: label }))
    askBot(qr.query)
  }

  const sendMessage = () => {
    if (!input.trim() || isTyping) return
    const text = input.trim()
    dispatch(addMessage({ id: `u-${Date.now()}`, sender: 'user', text }))
    setInput('')
    askBot(text)
  }

  return (
    <div
      ref={widgetRef}
      style={dragStyle}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-800 w-80 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 mb-4 flex flex-col overflow-hidden"
            style={{ height: 450 }}
          >
            <div
              onPointerDown={onPointerDown}
              className="bg-blue-600/90 dark:bg-blue-800/90 backdrop-blur-md text-white px-4 py-3 flex justify-between items-center shrink-0 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                  <img src={chatbotIcon} alt="" className="w-5 h-5 object-contain" />
                </span>
                <span className="font-bold text-sm">QuickBot</span>
              </div>
              <div className="bg-blue-700 dark:bg-blue-900 rounded-full px-2 py-1 text-xs flex gap-1 shadow-inner">
                <button
                  onClick={() => dispatch(setLanguage('en'))}
                  className={`px-2 py-0.5 rounded-full font-bold transition ${
                    language === 'en' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800' : 'text-white hover:bg-white/20'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => dispatch(setLanguage('hi'))}
                  className={`px-2 py-0.5 rounded-full font-bold transition ${
                    language === 'hi' ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800' : 'text-white hover:bg-white/20'
                  }`}
                >
                  HI
                </button>
              </div>
              <button onClick={() => dispatch(toggleChat())} className="sm:hidden text-white/80 hover:text-white">
                <Icon name="FaXmark" className="text-lg" />
              </button>
            </div>

            <div ref={scrollRef} className="chat-messages flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-slate-900 flex flex-col gap-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                    m.sender === 'bot'
                      ? 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 self-start'
                      : 'bg-blue-600 text-white self-end'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {isTyping && <TypingDots />}
            </div>

            <div className="px-3 pb-2 pt-2 bg-gray-50 dark:bg-slate-900 flex gap-2 overflow-x-auto no-scrollbar shrink-0 border-t border-gray-100 dark:border-slate-800">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.id}
                  onClick={() => handleQuickReply(qr)}
                  disabled={isTyping}
                  className="whitespace-nowrap text-xs bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
                >
                  {language === 'hi' ? qr.hi : qr.en}
                </button>
              ))}
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={language === 'hi' ? 'संदेश लिखें…' : 'Type a message...'}
                disabled={isTyping}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 dark:text-white rounded-lg outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-60"
              />
              <button
                onClick={sendMessage}
                disabled={isTyping}
                className="cursor-pointer active:scale-95 btn-glossy bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-lg flex items-center justify-center transition disabled:opacity-50"
              >
                <Icon name="FaPaperPlane" className="text-sm" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onPointerDown={onPointerDown}
        onClick={handleToggleClick}
        className="cursor-grab active:cursor-grabbing active:scale-95 chat-glow-pulse btn-glossy w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center hover:scale-105 transition relative z-50 select-none shadow-lg"
      >
        {open ? (
          <Icon name="FaXmark" className="text-2xl text-white" />
        ) : (
          <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner">
            <img src={chatbotIcon} alt="Chat assistant" className="w-9 h-9 object-contain" />
          </span>
        )}
        {!open && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
        )}
      </button>
    </div>
  )
}

export default ChatWidgetContainer
