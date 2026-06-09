import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategorySection from '../components/home/CategorySection';
import TrustBadges from '../components/home/TrustBadges';

const Home = () => {
  return (
    <div className="bg-surface-950 min-h-screen">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <TrustBadges />
    </div>
  );
};

export default Home;
