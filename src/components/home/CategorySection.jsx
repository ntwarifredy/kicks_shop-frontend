import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';

const categories = [
  { name: 'Running Shoes', icon: '🏃', color: 'from-blue-600/20 to-blue-800/10 border-blue-500/20', filter: 'Running' },
  { name: 'Casual Sneakers', icon: '👟', color: 'from-brand-600/20 to-brand-800/10 border-brand-500/20', filter: 'Casual' },
  { name: 'Skateboarding', icon: '🛹', color: 'from-emerald-600/20 to-emerald-800/10 border-emerald-500/20', filter: 'Skateboarding' },
  { name: 'Formal Shoes', icon: '👞', color: 'from-amber-600/20 to-amber-800/10 border-amber-500/20', filter: 'Formal' },
  { name: 'Sports & Training', icon: '⚽', color: 'from-stone-600/20 to-stone-800/10 border-stone-500/20', filter: 'Sports' },
  { name: 'Boots', icon: '🥾', color: 'from-sky-600/20 to-sky-800/10 border-sky-500/20', filter: 'Boots' },
  { name: 'Sandals & Slides', icon: '🩴', color: 'from-pink-600/20 to-pink-800/10 border-pink-500/20', filter: 'Sandals' },
  { name: 'Accessories', icon: '🧦', color: 'from-violet-600/20 to-violet-800/10 border-violet-500/20', filter: 'Accessories' },
];

const CategorySection = () => {
  return (
    <section className="py-12 lg:py-16 bg-surface-950">
      <div className="alibaba-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Shop by Category</h2>
            <p className="text-sm text-surface-400 mt-1">Find what you need from our curated categories</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors">
            View All <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/shop?search=${encodeURIComponent(cat.filter)}`}
              className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${cat.color} p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/30`}>
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-sm font-semibold text-white leading-tight mb-1">{cat.name}</h3>
              <p className="text-[11px] text-surface-500">Shop now</p>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link to="/shop" className="btn-secondary text-sm inline-flex items-center gap-1">
            View All Categories <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
