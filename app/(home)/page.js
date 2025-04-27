'use client'

import Image from 'next/image';
import Head from 'next/head';
import Slideshow from '@/components/Slideshow';

export default function Page() {
  
    return (
      <div className = "landing-page">
        <title>ICS-ASTRA</title>
        <link rel = "icon" href = "/astra-logo.png" />

        <div className = "showcase">
          <Slideshow />
        </div>

        
      </div>
    );
  }
  