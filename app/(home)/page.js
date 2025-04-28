'use client'

import Image from 'next/image';
import Head from 'next/head';
import Slideshow from '@/components/Slideshow';
import { FileText } from 'lucide-react';

export default function Page() {
  
    return (
      <div className = "relative bg-astratintedwhite">
        <title>ICS-ASTRA</title>
        <link rel = "icon" href = "/astra-logo.png" />

        <div className = "showcase">
          <Slideshow />
        </div>

        {/* ICS-ASTRA Defined */}
        <div>
          <div className='flex flex-col items-center p-[100px] gap-y-15'>
            <Image src="/astra-logo.png" width={300} height={300} alt='loc' className="shrink-0"/>
            <p className='font-medium text-3xl text-astrablack text-center w-2/3'>
              <span className='font-black text-4xl text-astraprimary'>ICS-ASTRA {" "}</span> 
              is a system catered towards the alumni of the Institute of Computer Science (ICS) of the University of the Philippines Los Baños (UPLB). Its purpose is to improve and maintain the connections between ICS and its alumni that it had produced over the years.  
            </p>
          </div>
        </div>

      <div className='bg-[#E5EAF8] w-full p-20 flex items-center justify-center gap-20'>
        <Image src="/astra-logo.png" width={450} height={425} alt='loc' className="shrink-0"/>
        <p className='w-1/3 text-right font-medium text-3xl text-astrablack'> Stay connected with the latest updates from Astra-ICS. From important news to exciting announcements, find out what’s happening, what’s new, and what’s coming next — all right here  </p>
      </div>
        
      </div>
    );
  }
  