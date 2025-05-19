export function capitalizeName(name) {
  if (!name) {
    return "";
  }

  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function capitalizeTitle(title) {
  return title
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(date, format, country = "en-PH") {
  if (date === null) {
    return "N/A";
  }

  if (country === null){
    country = "en-PH";
  }

  const formatOptions = {
    "short": { year: "2-digit", month: "2-digit", day: "2-digit" },
    "short-month": {year: "numeric", month: "short", day: "numeric"},
    "long": { year: "numeric", month: "long", day: "numeric" },
    "month-year": { year: "numeric", month: "long" },
    "year": { year: "numeric" },
    "complete": {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // optional
      timeZoneName: "short", // optional
    },
    "" : { year: "numeric", month: "2-digit", day: "2-digit" }
  };

  const options = formatOptions[format] || {};

  return new Date(date).toLocaleDateString(country, options);
}

export function formatSalary(salary) {
  if (salary === null) {
    return "N/A";
  }
  const cap = 1_000_000_000;
  if (salary > cap) {
    // Convert number to string and slice first 12 characters
    return `₱${salary.toLocaleString("en-US").slice(0, 13)}...`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(salary);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}