"use client";
import { useState } from "react";
import { Camera, Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import { PhotoType } from "../../../../common/scopes";

export const PersonalInfo = ({ 
  profileData, 
  isVerified, 
  setIsShowPersonalForm, 
  profileImage, 
  userId,
  onUpdateProfilePicture
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // File validation
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('type', PhotoType.PROFILE_PIC);
      formData.append('File', file);
      
      // First check if user already has a profile picture
      const existingPhotoResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/profile-pics`
      );
      
      const userPhoto = existingPhotoResponse.data.profilePics?.find(
        photo => photo.user_id === userId && photo.type === PhotoType.PROFILE_PIC
      );
      
      // If user already has a profile picture, delete it first
      if (userPhoto && userPhoto.id) {
        // console.log("Deleting existing photo with ID:", userPhoto.id);
        
        // Delete the existing photo
        const deleteResponse = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/${userPhoto.id}`
        );
        
        if (deleteResponse.data.status !== "DELETED") {
          console.warn("Warning: Failed to delete existing photo before upload");
          // Continue anyway - we'll just create a new photo
        } else {
          // console.log("Successfully deleted existing photo");
        }
      }
      
      // Now upload the new photo (always using POST since we deleted any existing photo)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // console.log("Created new photo:", response.data);
      
      // Inside handleFileChange function, after successful upload:
      if (response.data.status === "CREATED" || response.data.status === "OK") {
        onUpdateProfilePicture();
        
        window.dispatchEvent(new Event("profilePictureUpdated"));
      } else {
        alert('Failed to upload profile picture');
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      // Let's provide more detailed error information
      if (error.response) {
        console.error("Error details:", error.response.data);
        console.error("Status code:", error.response.status);
        
        // Show specific error message based on status code
        if (error.response.status === 404) {
          alert("Profile picture upload failed: API endpoint not found. Please contact support.");
        } else {
          alert(`Failed to upload profile picture: ${error.response.data.message || "Unknown error"}`);
        }
      } else {
        alert("Failed to upload profile picture. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  // The rest of the code remains unchanged
  const handleDeletePhoto = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // First, we need to get the photo ID from the user's profile pic
      const photoIdResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/profile-pics`
      );
      
      // Find the photo associated with this user
      const userPhoto = photoIdResponse.data.profilePics?.find(
        photo => photo.user_id === userId && photo.type === PhotoType.PROFILE_PIC
      );
      
      if (!userPhoto || !userPhoto.id) {
        alert('No profile picture found to delete');
        setIsDeleting(false);
        return;
      }
      
      // Now delete the photo using its ID
      const deleteResponse = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/photos/${userPhoto.id}`
      );
      
      // Inside handleDeletePhoto function, after successful deletion:
      if (deleteResponse.data.status === "DELETED") {
        onUpdateProfilePicture();
        
        window.dispatchEvent(new Event("profilePictureUpdated"));
      } else {
        alert('Failed to delete profile picture');
      }
    } catch (error) {
      if (error.response) {
        alert(`Failed to delete profile picture: ${error.response.data.message || "Unknown error"}`);
      } else {
        alert("Failed to delete profile picture. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <section className="bg-white rounded-lg px-10 py-12 mb-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Profile Picture Column */}
        <div className="flex flex-col justify-center items-center md:min-w-[200px]">
          <div className="relative group">
            <img
              src={profileImage || "https://cdn-icons-png.flaticon.com/512/145/145974.png"}
              alt="Profile Picture"
              className="w-[180px] h-[180px] rounded-full object-cover"
                crossOrigin="anonymous"  // Add this attribute
                onError={(e) => {       // Add error handler
                  e.target.onerror = null;
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/145/145974.png";
                }}
            />
            
            {isVerified && !isUploading && !isDeleting && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex flex-col justify-center items-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                <label className="cursor-pointer p-2 bg-white rounded-full hover:bg-gray-100 mb-2">
                  <Camera className="h-6 w-6 text-gray-700" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </label>
                
                {profileImage && (
                  <button 
                    onClick={handleDeletePhoto}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Trash2 className="h-6 w-6 text-red-500" />
                  </button>
                )}
              </div>
            )}
            
            {(isUploading || isDeleting) && (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex justify-center items-center">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
            )}
          </div>
          
          {isVerified && (
            <p className="text-sm text-gray-500 mt-2">
              {isUploading ? "Uploading..." : 
               isDeleting ? "Removing..." : 
               "Click to change"}
            </p>
          )}
        </div>

        {/* Profile Info Column */}
        <div className="flex-1">
          <div className="flex justify-left gap-4 items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">Profile Information</h2>
            {isVerified && (
              <button
                className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2 bg-[var(--color-astraprimary)] text-white hover:bg-[var(--color-astradark)] rounded-md"
                onClick={() => setIsShowPersonalForm(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-7">
            {Object.entries(profileData)
              .filter(([key, value]) => {
                const isMaidenName = key === "IsMaidenName";
                const isNullSuffix = key === "Suffix" && value === null;
                return !isMaidenName && !isNullSuffix;
              })
              .map(([key, value]) => {
                const label =
                  key === "LastName"
                    ? profileData.IsMaidenName
                      ? "Maiden Name"
                      : "Last Name"
                    : key.replace(/([A-Z])/g, " $1");

                return (
                  <div key={key} className="flex flex-col py-2">
                    <p className="text-sm font-semibold text-[var(--color-astrablack)] mb-1">{label}:</p>
                    <p className="text-sm text-[var(--color-astrablack)] text-left">{value}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};