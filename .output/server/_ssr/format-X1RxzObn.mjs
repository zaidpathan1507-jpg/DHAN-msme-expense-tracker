function formatINR(amount) {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.round(Math.abs(amount));
  return sign + "₹" + abs.toLocaleString("en-IN");
}
function formatCompactINR(amount) {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)}L`;
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`;
  return formatINR(amount);
}
export {
  formatCompactINR as a,
  formatINR as f
};
