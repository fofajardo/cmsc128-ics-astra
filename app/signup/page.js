import Link from "next/link";

export default function SignupPage() {
    return (
      <div className="form-background">
        <div className="form-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Sign Up</h2>
            <Link href="/login" className="text-[var(--primary)] text-sm hover:underline">
              I have an account
            </Link>
          </div>

          <form className="space-y-4">
            <div>
              <input type="email" placeholder="Email" className="form-input" />
            </div>
            <div>
              <input type="password" placeholder="Password" className="form-input" />
            </div>
            <div>
              <input type="password" placeholder="Confirm Password" className="form-input" />
            </div>
            <button type="submit" className="w-full btn-primary">
              Next
            </button>
          </form>

          <div className="flex justify-center mt-6 space-x-1">
            <div className="pagination-dot active"></div>
            <div className="pagination-dot"></div>
            <div className="pagination-dot"></div>
          </div>
        </div>
      </div>
    );
  }
  