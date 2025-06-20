// title = ''
// value = ''
// icon = <Icon/>
// route = ''


"use client";
import { useRouter } from "next/navigation";
import TransitionGrow from "./transitions/TransitionGrow";

export default function AdminStatCard({ title, value, icon, route, onClick=null, delay=0 }) {
  const router = useRouter();

  const handleClick = () => {
    if (route === false){onClick();}
    else router.push(route);
  };

  return (
    <TransitionGrow
      delay = {delay}
      onClick={handleClick}
      className="flex flex-row h-32 w-80 bg-gradient-to-tl from-astrawhite/20 to-astrawhite/50 backdrop-blur-md rounded-xl border border-astrawhite/15 shadow-lg transition-all hover:shadow-2xl hover:scale-[1.04] hover:border-astrawhite/30 cursor-pointer"
    >
      <div className="flex flex-col justify-center px-4">
        <div className="text-astrawhite font-lb">{title}</div>
        <div className="text-astrawhite font-h2">{value}</div>
      </div>
      <div className="ml-auto flex items-center pr-4">
        {icon}
      </div>
    </TransitionGrow>
  );
}
