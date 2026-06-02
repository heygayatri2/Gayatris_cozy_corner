import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Category from './pages/Category';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import AddPost from './admin/AddPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-post" element={<AddPost />} />
          <Route path="/admin/links" element={<div className="flex h-screen items-center justify-center text-xl font-display">Manage Links (WIP)</div>} />
        </Route>
        
        {/* Public Routes with Navbar/Footer */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/skincare" element={<Category category="skincare" />} />
                <Route path="/fashion" element={<Category category="fashion" />} />
                <Route path="/lifestyle" element={<Category category="lifestyle" />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/post/:slug" element={<PostDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;