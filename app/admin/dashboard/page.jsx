
"use client";
import AdminStatCard from "@/components/AdminStatCard";
import {GraduationCap, Calendar, Briefcase, HandHeart } from "lucide-react";
import BarGraph from "./components/bargraph";
import { Donut } from "./components/piechart";
import UpcomingEvents from "./components/UpcomingEvents";
import ActivityOverview from "./components/ActivityOverview";
import RecentActivity from "./components/RecentActivity";
import TransitionSlide from "@/components/transitions/TransitionSlide";



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
              <AdminStatCard delay={0.0} title='Active Alumni' value = {"999,999"} icon={<GraduationCap className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={"/admin/alumni/search"}/>
              <AdminStatCard delay={0.2} title='Active Job Posts' value = {27} icon={<Briefcase className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={"/admin/jobs"}/>
              <AdminStatCard delay={0.3} title='Active Events' value = {15} icon={<Calendar className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={"/admin/events"}/>
              <AdminStatCard delay={0.4} title='Funds Raised' value = {"999,999"} icon={<HandHeart className='size-13 text-astrawhite/>' strokeWidth={1.5}/>} route={"/admin/projects"}/>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-col bg-astradirtywhite w-full px-4 py-8 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row gap-4">
          <AlumAct_Events/>
          <FundsDonut/>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <ActivityBreakdown/>
          <Activity/>
        </div>
      </div>
    </>
  );
}

function ActivityBreakdown(){
  return <TransitionSlide className="flex-2 md:flex-3 h-auto w-auto">
    <BarGraph/>
  </TransitionSlide>;
}

function Activity(){
  return <TransitionSlide className="flex-2 h-auto w-auto">
    <RecentActivity/>
  </TransitionSlide>;
}

function AlumAct_Events(){
  return <div className="flex-grow flex flex-col gap-4">
    <TransitionSlide className="flex-2 flex-grow h-auto w-auto">
      <ActivityOverview/>
    </TransitionSlide>
    <TransitionSlide className="flex-2 flex-grow h-auto w-auto">
      <UpcomingEvents/>
    </TransitionSlide>
  </div>;
}

function FundsDonut(){
  return <TransitionSlide className="flex-1 h-auto w-auto md:row-start-1 md:row-span-8 md:col-start-3">
    <div className="size-full">
      <Donut />
    </div>
  </TransitionSlide>;
}

