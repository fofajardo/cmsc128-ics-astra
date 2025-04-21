'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Back() {
    const router = useRouter();
    
    const back = () => {
        router.back();
    };

    return (
        <div onClick={back} className="!cursor-pointer flex gap-2 self-start ml-15 mb-5">
            <ArrowLeft size="29" className="shrink-0"/>
            <button className="!cursor-pointer text-astrablack font-semibold text-xl">Back</button>
        </div>
  )}