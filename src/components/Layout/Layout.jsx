import Header from './Header';
import Footer from './Footer';
const Layout = ({ children, showFooter = true }) => {
    return (<div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>);
};
export default Layout;
