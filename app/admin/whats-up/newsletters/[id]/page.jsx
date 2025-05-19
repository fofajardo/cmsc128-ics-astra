"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GoBackButton } from "@/components/Buttons";
import { Download, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import ToastNotification from "@/components/ToastNotification";
import axios from "axios";
import { PhotoType } from "../../../../../common/scopes.js";

export default function NewsletterDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newsletter, setNewsletter] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPDF = async () => {
      setIsLoading(true);
      try {
        // Fetch newsletter content
        const contentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`
        );

        if (contentResponse.data.status === "OK") {
          setNewsletter(contentResponse.data.content);

          // Fetch PDF file
          const photoResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/by-content-id/${id}`
          );

          if (photoResponse.data.status === "OK" && photoResponse.data.photos?.length > 0) {
            const pdfKey = photoResponse.data.photos[0].image_key;
            // Get signed URL for the PDF
            const signedUrlResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/sign/${pdfKey}`
            );

            if (signedUrlResponse.data.status === "OK") {
              setPdfUrl(signedUrlResponse.data.url);
              
              // Load PDF.js only when we have the URL
              if (typeof window !== 'undefined') {
                const pdfjsLib = window['pdfjs-dist/build/pdf'];
                pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                
                const loadingTask = pdfjsLib.getDocument(signedUrlResponse.data.url);
                const pdf = await loadingTask.promise;
                setNumPages(pdf.numPages);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading newsletter:", error);
        setToast({ type: "error", message: "Failed to load newsletter" });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPDF();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/v1/contents/${id}`);
      setToast({ type: "success", message: "Newsletter deleted successfully" });
      setTimeout(() => router.push("/admin/whats-up"), 1500);
    } catch (error) {
      console.error("Delete failed:", error);
      setToast({ type: "error", message: "Failed to delete newsletter" });
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-astradirtywhite p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <GoBackButton />
          <div className="flex gap-2">
            {pdfUrl && (
              <a 
                href={pdfUrl}
                download={`${newsletter?.title || 'newsletter'}.pdf`}
                className="blue-button flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="red-button flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {toast && (
          <ToastNotification
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {showDeleteModal && (
          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Newsletter"
            description="Are you sure you want to delete this newsletter? This action cannot be undone."
            confirmLabel="Delete"
            confirmColor="red"
          />
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-astraprimary"></div>
          </div>
        ) : (
          <div className="bg-astrawhite rounded-xl shadow-md overflow-hidden">
            {pdfUrl ? (
              <div className="relative">
                <iframe
                  src={`${pdfUrl}#view=FitH`}
                  className="w-full h-[800px]"
                  title={newsletter?.title || "Newsletter PDF"}
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-astradarkgray/80 text-white px-4 py-2 rounded-lg">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="hover:text-astraprimary disabled:opacity-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span>
                    Page {currentPage} of {numPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                    disabled={currentPage === numPages}
                    className="hover:text-astraprimary disabled:opacity-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-96 text-astragray">
                No PDF available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
