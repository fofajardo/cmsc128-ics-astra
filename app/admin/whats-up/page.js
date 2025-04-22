import Link from "next/link";

export default function WhatsUpAdminPage() {
    return (
        <div className="p-8">
            <h1 className="font-h1 text-astrablack">Admin - What's Up?</h1>
            <p className="font-r text-astradarkgray mt-4">
                Manage and publish updates, announcements, and news for the alumni network.
            </p>
            <Link href="/whats-up">
                <a className="blue-button mt-6">Go to Newsletter & Announcements</a>
            </Link>
        </div>
    );
}
