const colorPalette = [
  "bg-red-200/20 border-red-600 text-red-600",
  "bg-orange-200/20 border-orange-600 text-orange-600",
  "bg-amber-200/20 border-amber-600 text-amber-600",
  "bg-yellow-200/20 border-yellow-600 text-yellow-600",
  "bg-lime-200/20 border-lime-600 text-lime-600",
  "bg-green-200/20 border-green-600 text-green-600",
  "bg-emerald-200/20 border-emerald-600 text-emerald-600",
  "bg-teal-200/20 border-teal-600 text-teal-600",
  "bg-cyan-200/20 border-cyan-600 text-cyan-600",
  "bg-sky-200/20 border-sky-600 text-sky-600",
  "bg-blue-200/20 border-blue-600 text-blue-600",
  "bg-indigo-200/20 border-indigo-600 text-indigo-600",
  "bg-violet-200/20 border-violet-600 text-violet-600",
  "bg-fuchsia-200/20 border-fuchsia-600 text-fuchsia-600",
  "bg-rose-200/20 border-rose-600 text-rose-600",
];



function getColorFromText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}


export default function SkillTag({ text, margin }) {
  const color = getColorFromText(text);

  return (
    <span className={`px-3 py-2 rounded-full text-xs font-medium border ${color} ${margin}`}>
      {text}
    </span>
  );
}

