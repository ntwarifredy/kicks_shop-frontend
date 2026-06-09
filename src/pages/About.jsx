const About = () => {
  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">About KICKS_SHOP</h1>
          <p className="text-surface-400 max-w-2xl mx-auto text-lg">
            We're passionate about footwear. Our mission is to bring you the best selection of premium shoes from top brands around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-surface-400 leading-relaxed mb-4">
              Founded in 2020, KICKS_SHOP started as a small online store with a big dream - to make premium footwear accessible to everyone. What began as a passion project has grown into one of the most trusted online shoe retailers.
            </p>
            <p className="text-surface-400 leading-relaxed">
              We work directly with leading brands to bring you authentic products at competitive prices. Our team of shoe enthusiasts personally curates every collection to ensure quality and style.
            </p>
          </div>
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-8 text-center border border-brand-500/20">
            <p className="text-6xl font-bold text-white">500+</p>
            <p className="text-brand-300 mt-2">Premium Products</p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div><p className="text-3xl font-bold text-white">10K+</p><p className="text-sm text-brand-300">Customers</p></div>
              <div><p className="text-3xl font-bold text-white">50+</p><p className="text-sm text-brand-300">Brands</p></div>
              <div><p className="text-3xl font-bold text-white">99%</p><p className="text-sm text-brand-300">Satisfaction</p></div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center hover:border-surface-600 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quality First</h3>
              <p className="text-surface-400 text-sm">We handpick every product to ensure the highest quality standards.</p>
            </div>
            <div className="card p-6 text-center hover:border-surface-600 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-surface-400 text-sm">Free shipping on orders over $100 with express delivery available.</p>
            </div>
            <div className="card p-6 text-center hover:border-surface-600 transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Customer Love</h3>
              <p className="text-surface-400 text-sm">Our customers are at the heart of everything we do. 24/7 support.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {['Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emily Williams'].map((name, idx) => (
              <div key={name} className="card p-6 text-center hover:border-surface-600 transition-all group">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-600 to-brand-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-semibold text-white">{name}</h3>
                <p className="text-sm text-surface-400">{['CEO & Founder', 'Head of Design', 'Marketing Director', 'Customer Success'][idx]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
