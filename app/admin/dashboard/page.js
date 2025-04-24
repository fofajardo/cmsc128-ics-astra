
"use client"
import AdminStatCard from "@/components/AdminStatCard";
import {GraduationCap, Calendar, Briefcase, HandHeart } from "lucide-react";
import { LineGraph } from "./components/linegraph";
import { Donut } from "./components/piechart";

export default function Dashboard() {
    return (
        <>
            {/* Header with background */}
            <div className="relative">
                <img
                src="/blue-bg.png"
                alt="Background"
                className="h-80 w-full object-cover"
                />
                <div className="absolute inset-2 flex flex-col items-center justify-evenly text-astrawhite z-20">
                <div className="text-center pt-6">
                    <h1 className="font-h1">Welcome Back, ICS Admin!</h1>
                    <p className="font-s">Here's a quick overview of what’s happening today</p>
                </div>
                <div className="pt-6 pb-4 overflow-y-scroll w-full scrollbar-hide">
                    <div className="flex flex-row gap-3 min-w-max px-4 justify-center"> 
                        <AdminStatCard title='Active Alumni' value = {"999,999"} icon={<GraduationCap className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={'/admin/alumni/search'}/>
                        <AdminStatCard title='Active Job Posts' value = {27} icon={<Briefcase className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={'/admin/jobs'}/>
                        <AdminStatCard title='Active Events' value = {15} icon={<Calendar className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={'/admin/events'}/>
                        <AdminStatCard title='Funds Raised' value = {"999,999"} icon={<HandHeart className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={'/admin/projects'}/>
                    </div>
                </div>
                </div>
            </div>

            <div className="bg-astratintedwhite">
                <LineGraph/>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 md:grid-rows-8 gap-4 mt-4">
                    <div className="bg-white rounded-xl border-astralightgray shadow-md col-span-1 md:col-span-2 md:row-span-4 md:h-auto">
                         
                    </div>
                    <div className="col-span-1 row-start-3 md:row-start-1 md:row-span-8 md:col-start-3 md:h-auto">
                        <Donut/>
                    </div>
                    <div className="bg-white rounded-xl border-astralightgray shadow-md col-span-1 md:col-span-2 md:row-span-4 md:row-start-5 md:h-auto">

                    </div>
                </div>
            </div>
        </>
      );
}