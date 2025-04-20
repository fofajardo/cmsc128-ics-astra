'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Back() {
    const router = useRouter();
    
    const back = () => {
        router.back();
    };

    return (
        <div onClick={back} className="flex gap-2 self-start ml-15 mb-5">
            <ArrowLeft size="29" className="shrink-0"/>
            <button className="text-astrablack font-semibold text-xl">Back</button>
        </div>
  )}