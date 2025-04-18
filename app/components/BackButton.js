'use client'

import { useRouter } from 'next/navigation'

export default function GoBackButton() {
    const router = useRouter()
  
    return (
        <button
        onClick={() => router.back()}
        className={`inline-flex items-baseline text-astrablack hover:text-astradark font-rb`}
      >
        <span className="mr-1 text-xl">←</span>
        Go Back
      </button>
    )
  }
