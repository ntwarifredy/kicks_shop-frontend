const Loader = ({ size = 'md', fullPage = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  const spinner = (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-surface-700 border-t-brand-600`} />
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-950">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default Loader;
