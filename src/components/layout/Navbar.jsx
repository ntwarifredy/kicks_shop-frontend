import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { CartContext } from '../../context/CartContext';
import {
  HiOutlineShoppingCart, HiOutlineUser,
  HiOutlineSearch, HiOutlineMenu, HiOutlineX, HiOutlineLogout,
  HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineStar,
  HiOutlineChevronDown
} from 'react-icons/hi';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [catOpen, setCatOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchTerm.trim());
      if (category !== 'All Categories') {
        params.set('category', category);
      }
      navigate(`/shop?${params.toString()}`);
      setSearchTerm('');
      setCatOpen(false);
    }
  };

  const categories = ['All Categories', 'Running', 'Casual', 'Sports', 'Formal'];
  const navCategories = ['Running', 'Casual', 'Sports', 'Formal', 'Boots', 'Sandals'];

  return (
    <nav className="sticky top-0 z-50">
      {/* Row 1: Main Header */}
      <div className="h-16 bg-[#0a0a1a] flex items-center px-4 md:px-6">
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-surface-400 hover:text-white p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors">
          {mobileOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
        </button>

        <Link to="/" className="flex items-center gap-0.5 shrink-0 mr-4 md:mr-8">
          <span className="text-xl md:text-2xl font-extrabold text-brand-600">KICKS</span>
          <span className="text-xl md:text-2xl font-light text-white">_SHOP</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl items-center">
          <div className="relative">
            <button type="button" onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1 h-10 px-3 bg-white text-gray-900 text-sm font-medium rounded-l-md border-r border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap">
              <span className="text-xs">{category}</span>
              <HiOutlineChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCatOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1">
                  {categories.map((cat) => (
                    <button key={cat} type="button" onClick={() => { setCategory(cat); setCatOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm ${category === cat ? 'text-brand-600 font-medium bg-brand-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What are you looking for?"
            className="h-10 flex-1 bg-white text-gray-900 placeholder-gray-400 px-4 text-sm focus:outline-none"
          />
          <button type="submit"
            className="h-10 bg-brand-600 hover:bg-brand-500 text-white px-6 text-sm font-medium rounded-r-md transition-colors flex items-center gap-1.5">
            <HiOutlineSearch className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          <Link to="/shop" className="md:hidden text-surface-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
            <HiOutlineSearch className="w-5 h-5" />
          </Link>

          <Link to="/cart" className="md:hidden relative text-surface-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
            <HiOutlineShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center overflow-hidden relative">
                  {user?.avatar && (
                    <img src={user.avatar} alt={user.name} className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  )}
                  <span className="text-xs font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <span className="hidden lg:block text-sm">{user?.name?.split(' ')[0]}</span>
                <HiOutlineChevronDown className="hidden lg:block w-3.5 h-3.5" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-surface-900 border border-surface-700 rounded-2xl shadow-xl shadow-black/50 z-20 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-surface-800">
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-surface-400">{user?.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800 transition-colors">
                        <HiOutlineViewGrid className="w-4 h-4 text-brand-400" /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800 transition-colors">
                      <HiOutlineUser className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800 transition-colors">
                      <HiOutlineClipboardList className="w-4 h-4" /> Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800 transition-colors">
                      <HiOutlineStar className="w-4 h-4" /> Wishlist
                    </Link>
                    <div className="border-t border-surface-800 mt-2 pt-2">
                      <button onClick={() => { setProfileOpen(false); logout(); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-surface-800 transition-colors">
                        <HiOutlineLogout className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login"
              className="flex items-center gap-1.5 text-surface-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <HiOutlineUser className="w-5 h-5" />
              <span className="hidden md:block text-sm">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Row 3: Category Navigation */}
      <div className="hidden md:flex h-11 items-center bg-[#0a0a1a] border-t border-white/5 px-6">
        <Link to="/shop"
          className="flex items-center gap-2 h-full bg-brand-600 text-white px-4 text-sm font-medium hover:bg-brand-500 transition-colors shrink-0">
          <HiOutlineViewGrid className="w-4 h-4" />
          <span>All Categories</span>
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto ml-4 flex-1 scrollbar-none">
          {navCategories.map((cat) => (
            <Link key={cat} to={`/shop?category=${cat}`}
              className="text-sm text-surface-300 hover:text-white px-3 py-1.5 rounded hover:bg-white/5 transition-colors whitespace-nowrap">
              {cat}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4 ml-auto shrink-0">
          <Link to="/orders"
            className="text-sm text-surface-400 hover:text-white transition-colors whitespace-nowrap">Orders & Returns</Link>
          <Link to="/cart"
            className="text-sm text-surface-400 hover:text-white transition-colors whitespace-nowrap relative">Cart{cartCount > 0 && (
              <span className="bg-brand-600 text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center absolute -top-2 -right-4">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a1a] border-t border-white/5 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">

            {navCategories.map((cat) => (
              <Link key={cat} to={`/shop?category=${cat}`} onClick={() => setMobileOpen(false)}
                className="block text-surface-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2.5 text-sm transition-colors">
                {cat}
              </Link>
            ))}
            <Link to="/shop" onClick={() => setMobileOpen(false)}
              className="block text-surface-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2.5 text-sm transition-colors">All Products</Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="block text-surface-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2.5 text-sm transition-colors">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="block text-brand-400 hover:text-brand-300 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors">Register</Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <div className="border-t border-white/5 pt-2 mt-2">
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    className="block text-surface-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2.5 text-sm transition-colors">Profile</Link>
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)}
                    className="block text-surface-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2.5 text-sm transition-colors">Wishlist</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)}
                      className="block text-brand-400 hover:text-brand-300 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors">Admin Dashboard</Link>
                  )}
                  <button onClick={() => { setMobileOpen(false); logout(); }}
                    className="block text-red-400 hover:text-red-300 rounded-lg px-3 py-2.5 text-sm w-full text-left transition-colors">Logout</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
