import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export function AuthBackToHomeLink() {
  return (
    <Link
      href="/"
      className="flex items-center text-[var(--color-astrablack)] hover:text-[var(--color-astraprimary)] transition-colors text-sm md:text-base font-medium mb-4"
    >
      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2"/>
      Back to Home
    </Link>
  );
}