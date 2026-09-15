import Header from './common/Header.jsx'
import Footer from './common/Footer.jsx'
import ChatWidget from './features/chat/ChatWidgetContainer.jsx'
import AppRoutes from './router/AppRoutes.jsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
