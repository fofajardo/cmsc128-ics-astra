// title = ''
// value = ''
// icon = <Icon/>
// route = ''


'use client'
import { useRouter } from 'next/navigation';

export default function AdminStatCard({ title, value, icon, route }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-row h-32 w-64 bg-gradient-to-tl from-astrawhite/20 to-astrawhite/50 backdrop-blur-md rounded-xl border border-astrawhite/15 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:border-astrawhite/30 cursor-pointer"
    >
      <div className="flex flex-col justify-center px-4">
        <div className="text-astrawhite font-lb">{title}</div>
        <div className="text-astrawhite font-h2">{value}</div>
      </div>
      <div className="ml-auto flex items-center pr-4">
        {icon}
      </div>
    </div>
  );
}
