const variants = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  info: 'bg-brand-500/10 text-brand-300 border-brand-500/20'
};

const Message = ({ variant = 'info', children, className = '' }) => (
  <div className={`border px-4 py-3 rounded-xl ${variants[variant]} ${className}`}>
    {children}
  </div>
);

export default Message;
