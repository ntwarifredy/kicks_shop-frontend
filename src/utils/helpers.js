export const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

export const getDiscountPercentage = (price, discountPrice) =>
  Math.round(((Number(price) - Number(discountPrice)) / Number(price)) * 100);

export const getDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export const placeholderImg = (w = 300, h = 300, text = 'N') =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect fill='%231f2937' width='${w}' height='${h}'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='${Math.min(w,h)/12}' x='${w/2}' y='${h/2}' text-anchor='middle' dominant-baseline='middle'%3E${text}%3C/text%3E%3C/svg%3E`;
