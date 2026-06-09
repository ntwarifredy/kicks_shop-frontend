import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppChat from '../common/WhatsAppChat';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950 text-white">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <WhatsAppChat />
    </div>
  );
};

export default Layout;
