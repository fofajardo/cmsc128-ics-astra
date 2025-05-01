export function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(date, format) {
  if (date === null) {
    return "N/A";
  }

  const formatOptions = {
    "short": { year: "2-digit", month: "2-digit", day: "2-digit" },
    "long": { year: "numeric", month: "long", day: "numeric" },
    "month-year": { year: "numeric", month: "long" },
    "year": { year: "numeric" },
    "" : { year: "numeric", month: "2-digit", day: "2-digit" }
  };

  const options = formatOptions[format] || {};

  return new Date(date).toLocaleDateString("en-US", options);
}

export function formatSalary(salary) {
  if (salary === null) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(salary);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}