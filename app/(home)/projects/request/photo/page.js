"use client"; 
 
import React, { useState, useEffect } from "react"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import Link from "next/link"; 
 
const RequestFundraiserPhoto = () => { 
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize states with URL parameters if they exist
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState("");

  // Retrieve previous page data
  const amount = searchParams.get('amount');
  const zipCode = searchParams.get('zipCode');
  const title = searchParams.get('title');
  const description = searchParams.get('description');


  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setPhotoError("Please upload an image or video file");
        return;
      }

      setPhotoFile(file);
      
      // Create a preview URL for the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setPhotoError("");
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if a photo has been uploaded
  const isFormValid = photoPreview && !photoError;

  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // Handle click on the upload area
  const handleUploadAreaClick = () => {
    document.getElementById('photo-upload').click();
  };

  return ( 
    <div className="min-h-screen w-full flex flex-col md:flex-row"> 
      {/*edit left side*/} 
      <div className="w-full md:w-[35%] bg-astralightgray flex py-12 md:py-0"> 
        <div className="flex flex-col items-start space-y-6 pl-10 pt-60 ml-6"> 
          {/* Header text */} 
          <h2 className="text-5xl text-astrablack text-left"> 
          Share a photo <br/> with us
          </h2> 
          <p className="font-r text-astrablack text-left tracking-wide"> 
            Help others connect with your story by<br /> 
            adding a photo or video.
          </p> 
        </div> 
      </div> 
 
      {/*edit right side*/} 
      <div className="w-full md:w-[65%] bg-astrawhite flex flex-col min-h-[50vh] md:min-h-screen"> 
        {/* Centered content */} 
        <div className="flex-grow flex flex-col justify-center items-center px-4 md:px-0"> 
          <div className="flex flex-col items-center space-y-4 w-full md:w-[70%] mt-10"> 
            {/* Header */} 
            <h3 className="font-l text-astrablack self-start w-full"> 
            Almost done. Add a fundraiser photo
            </h3> 
            <p className="font-s text-astrablack self-start w-full">
            A high-quality photo or video will help tell your story and build trust with donors
              </p>
            {/* form */} 
            <div className="w-full space-y-6">
              {/* Photo upload field */}
              <div className="w-full">
                <div 
                  onClick={handleUploadAreaClick}
                  className="relative w-full h-64 border-2 border-dashed border-astradarkgray rounded-lg hover:border-astraprimary transition-all cursor-pointer overflow-hidden"
                >
                  {/* Hidden file input */}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {photoPreview ? (
                    // Show preview if file is uploaded
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      {photoFile && photoFile.type.startsWith('image/') ? (
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <video 
                          src={photoPreview} 
                          controls 
                          className="max-w-full max-h-full"
                        />
                      )}
                    </div>
                  ) : (
                    // Show upload prompt if no file
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="relative">
                        <i className="fas fa-camera text-4xl text-astraprimary"></i>
                        <span className="absolute -top-1 -right-1 bg-astraprimary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          +
                        </span>
                      </div>
                      <p className="text-astraprimary font-r">
                        Add photo or video
                      </p>
                    </div>
                  )}
                </div>
                {photoError && (
                  <p className="text-red-500 text-sm mt-2">{photoError}</p>
                )}
              </div>
            </div>
          </div> 
        </div> 
 
        {/* Bottom navigation */} 
        <div className="flex justify-between px-6 md:px-12 py-5 border-astralightgray border-t-1"> 
          <button 
            onClick={handleBack}
            className="flex items-center text-astradarkgray hover:text-astraprimary transition-colors font-r transition cursor-pointer"
          > 
            <i className="fas fa-arrow-left mr-2"></i> 
          </button> 
          {isFormValid ? (
            <Link href="/projects/request/preview" passHref> 
              <button className="blue-button font-semibold transition cursor-pointer w-[150px] h-[55px]"> 
                Continue 
              </button> 
            </Link>
          ) : (
            <button 
              disabled
              className="bg-astradarkgray text-astrawhite font-semibold py-2 px-6 rounded-xl shadow cursor-not-allowed w-[150px] h-[55px] opacity-50"
            > 
              Continue 
            </button>
          )}
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default RequestFundraiserPhoto;