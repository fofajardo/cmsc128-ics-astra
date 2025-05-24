"use client";
import React, {useEffect, useRef, useState} from "react";
import {Camera, LaptopMinimal, Trash} from "lucide-react";
import {
  Dialog,
  DialogContent, DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {toast} from "@/components/ToastNotification.jsx";
import Image from "next/image";
import {Form, Formik} from "formik";
import axios from "axios";
import {clientRoutes} from "../../../../common/routes.js";
import httpStatus from "http-status-codes";
import LoadingOverlay from "@/components/LoadingOverlay.jsx";
import {useSignedInUser} from "@/components/UserContext.jsx";

export default function ProfilePictureModal({ context }) {
  const signedInUser = useSignedInUser();
  const [open, setOpen] = useState(false);
  const [isSavePage, setIsSavePage] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);

  const handleReset = function() {
    setIsSavePage(false);
    setAvatarUrl(context.state.avatarUrl);
    setRemoveProfilePicture(false);
  };

  useEffect(function() {
    if (open) {
      handleReset();
    }
  }, [open]);

  const initialValues = {
    profile_picture_file: null
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let response = null;

      if (removeProfilePicture) {
        response = await axios.delete(clientRoutes.users.getAvatar(context.state.user.id));
      } else {
        const formData = new FormData();
        formData.append("avatar", values.profile_picture_file);

        response = await axios.post(clientRoutes.users.getAvatar(context.state.user.id), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === httpStatus.CREATED) {
        toast({ variant: "success", title: "Your profile picture has been saved!" });
        context.actions.setAvatarUrl(avatarUrl);
        if (context.state.user.id === signedInUser.state.user.id) {
          signedInUser.actions.setAvatarUrl(avatarUrl);
        }
      } else if (response.status === httpStatus.OK && removeProfilePicture) {
        toast({ variant: "success", title: "Your profile picture has been removed!" });
        context.actions.setAvatarUrl("https://cdn-icons-png.flaticon.com/512/145/145974.png");
        if (context.state.user.id === signedInUser.state.user.id) {
          signedInUser.actions.setAvatarUrl("https://cdn-icons-png.flaticon.com/512/145/145974.png");
        }
      }
      setOpen(false);
    } catch (error) {
      toast({ variant: "fail", title: error?.response?.data?.message ?? "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  const fileInputRef = useRef(null);

  const handleUploadClick = function() {
    fileInputRef.current.click();
  };

  const handleRemoveClick = function() {
    setAvatarUrl("https://cdn-icons-png.flaticon.com/512/145/145974.png");
    setIsSavePage(true);
    setRemoveProfilePicture(true);
  };

  const buildForm = ({ setFieldValue, isSubmitting }) => {
    const handleImageChange = function(e) {
      setFieldValue("profile_picture_file", e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
      setIsSavePage(true);
    };
    return (
      <Form className="space-y-4 flex flex-col items-center">
        <LoadingOverlay loading={isSubmitting} className="rounded-lg"/>
        <Image
          src={avatarUrl}
          alt="Profile Picture"
          width={256}
          height={256}
          className="w-[256px] h-[256px] rounded-full border-2 border-gray-50 shadow-sm"
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          ref={fileInputRef}
          id="profile-picture-upload"
        />
        <DialogFooter className="mt-6 flex justify-center space-x-4">
          {
            isSavePage ? (
              <>
                <button
                  type="submit"
                  className="text-sm md:text-base px-4 py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)] transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-sm md:text-base px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex gap-2"
                  onClick={handleReset}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="text-sm md:text-base px-4 py-2 bg-[var(--color-astraprimary)] text-white rounded-lg hover:bg-[var(--color-astradark)] transition-colors flex gap-2"
                  onClick={handleUploadClick}
                >
                  <LaptopMinimal />
                  Upload from computer
                </button>
                <button
                  type="button"
                  className="text-sm md:text-base px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex gap-2"
                  onClick={handleRemoveClick}
                >
                  <Trash />
                  Remove
                </button>
              </>
            )
          }
        </DialogFooter>
      </Form>

    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="relative">
        <Image
          src={context.state.avatarUrl}
          alt="Profile Picture"
          width={128}
          height={128}
          className="w-[128px] h-[128px] rounded-full border-2 border-gray-50 shadow-sm"
        />
        <div className="absolute bottom-0 right-0 opacity-0 cursor-pointer w-32 h-32 rounded-full"></div>
        <label
          htmlFor="profile-picture-upload"
          className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-50 rounded-full cursor-pointer"
        >
          <Camera className="text-white" size={16}/>
        </label>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
          <DialogDescription>
            A picture helps people recognize you and lets you know when you’re signed in to your account.
          </DialogDescription>
        </DialogHeader>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} component={buildForm}/>
      </DialogContent>
    </Dialog>
  );
}