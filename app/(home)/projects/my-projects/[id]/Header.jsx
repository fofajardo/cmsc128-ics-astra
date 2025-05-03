// Header.jsx
import { HeartHandshake } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-astraprimary to-astraprimary/90 pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-astrawhite mb-2">My Projects</h1>
            <p className="text-astrawhite/80">
              Manage and track all your fundraising projects in one place
            </p>
          </div>
          <button
            onClick={() => router.push("/projects/request/goal")}
            className="bg-astrawhite text-astraprimary py-2 px-4 rounded-lg flex items-center gap-2 font-medium transition-colors hover:bg-astrawhite/90 shadow-lg"
          >
            <HeartHandshake className="w-5 h-5" />
            Request Fundraiser
          </button>
        </div>
      </div>
    </div>
  );
}