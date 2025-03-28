import Link from "next/link";
import { User } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="form-background">
      <div className="form-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">Sign In</h2>
          <Link href="/signup" className="text-[var(--primary)] text-sm hover:underline">
            Create an account
          </Link>
        </div>

        <form className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              className="form-input" 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="form-input" 
            />
          </div>
          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-[var(--primary)] text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <div className="mt-6">
          <button className="w-full border border-border-color rounded-md py-2 px-4 flex items-center justify-center hover:bg-light-blue transition-colors">
            <div className="user-icon">
              <User size={18} className="text-[var(--medium-gray)]" />
            </div>
            <span className="text-sm text-[var(--foreground)]">Continue as Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
}