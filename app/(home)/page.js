'use client'

import Image from 'next/image';
import Head from 'next/head';
import Slideshow from '@/components/Slideshow';
import { FileText } from 'lucide-react';

export default function Page() {
  
    return (
      <div className = "landing-page">
        <title>ICS-ASTRA</title>
        <link rel = "icon" href = "/astra-logo.png" />

        <div className = "showcase">
          <Slideshow />
        </div>

        <div className = "bg-astratintedwhite">
          <div style = {{display: 'flex', justifyContent: 'center', padding: '50px'}}>
            <img src = '/astra-logo.png'/>
          </div>
        </div>

        
      </div>
    );
  }
  