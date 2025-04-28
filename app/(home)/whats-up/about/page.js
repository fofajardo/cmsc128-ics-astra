'use client';
import { GoBackButton } from "@/components/Buttons";

export default function AboutWhatsUp() {
  return (
    <div className="min-h-screen bg-astradirtywhite pt-40 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <GoBackButton />
        
        <div className="mt-8 bg-astrawhite rounded-xl overflow-hidden shadow-md p-8">
          <h1 className="font-h1 text-astrablack mb-6">About What's Up</h1>
          
          <div className="prose max-w-none">
            <p className="font-r text-astradarkgray mb-6">
              Welcome to What's Up, your central hub for staying connected with the UPLB-ICS community. Here you'll find the latest announcements, news, and updates about our vibrant academic community.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-astratintedwhite p-6 rounded-lg">
                <h3 className="font-rb text-astraprimary mb-3">Announcements</h3>
                <p className="font-s text-astradarkgray">
                  Stay informed about important updates, events, and opportunities within the UPLB-ICS community.
                </p>
              </div>

              <div className="bg-astratintedwhite p-6 rounded-lg">
                <h3 className="font-rb text-astraprimary mb-3">Newsletters</h3>
                <p className="font-s text-astradarkgray">
                  Access our collection of newsletters featuring in-depth stories and monthly highlights.
                </p>
              </div>
            </div>

            <p className="font-r text-astradarkgray">
              Our platform is designed to keep alumni, students, and faculty members connected and informed about the latest developments in our community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
