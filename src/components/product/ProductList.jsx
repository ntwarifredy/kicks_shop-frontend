import ProductCard from './ProductCard';

const ProductList = ({ products = [], loading = false, error = '' }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-surface-700 border-t-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-16">
        <p className="text-surface-400 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
