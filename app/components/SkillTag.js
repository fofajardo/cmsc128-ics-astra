export default function SkillTag({ text, color }) {
    return (
      <span className={`px-3 py-2 rounded-full text-xs font-medium ${color} border`}>
        {text}
      </span>
    );
  }
  