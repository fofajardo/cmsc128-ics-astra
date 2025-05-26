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

export default function DegreeProofModal({ context }) {
  const signedInUser = useSignedInUser();
  const [open, setOpen] = useState(false);
  const [isSavePage, setIsSavePage] = useState(false);

  const [degreeProof, setDegreeProof] = useState("");
  const [degreeProofHasBlob, setDegreeProofHasBlob] = useState(false);
  const [removeDegreeProof, setRemoveDegreeProof] = useState(false);

  const handleReset = function() {
    setIsSavePage(false);
    if (degreeProofHasBlob) {
      URL.revokeObjectURL(degreeProof);
    }
    setDegreeProofHasBlob(false);
    setDegreeProof(context.state.degreeProofUrl);
    setRemoveDegreeProof(false);
  };

  useEffect(function() {
    if (open) {
      handleReset();
    }
  }, [open]);

  const initialValues = {
    degree_proof_file: null
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let response;

      if (removeDegreeProof) {
        response = await axios.delete(clientRoutes.users.getDegreeProof(context.state.user.id));
      } else {
        const formData = new FormData();
        formData.append("degree_proof", values.degree_proof_file);

        response = await axios.post(clientRoutes.users.getDegreeProof(context.state.user.id), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === httpStatus.CREATED) {
        toast({ variant: "success", title: "Your proof of graduation has been saved!" });
        context.actions.setDegreeProofUrl(response.data.degree_proof_url);
        if (context.state.user.id === signedInUser.state.user.id) {
          signedInUser.actions.setDegreeProofUrl(response.data.degree_proof_url);
        }
        setDegreeProofHasBlob(false);
        URL.revokeObjectURL(degreeProof);
      } else if (response.status === httpStatus.OK && removeDegreeProof) {
        toast({ variant: "success", title: "Your proof of graduation has been removed!" });
        context.actions.setDegreeProofUrl("https://cdn-icons-png.flaticon.com/512/8373/8373460.png");
        if (context.state.user.id === signedInUser.state.user.id) {
          signedInUser.actions.setDegreeProofUrl("https://cdn-icons-png.flaticon.com/512/8373/8373460.png");
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
    setDegreeProof("https://cdn-icons-png.flaticon.com/512/8373/8373460.png");
    setIsSavePage(true);
    setRemoveDegreeProof(true);
  };

  const buildForm = ({ setFieldValue, isSubmitting }) => {
    const handleImageChange = function(e) {
      const file = e.target.files[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({ variant: "fail", title: "Please select an image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: "fail", title: "File size should be less than 5MB" });
        return;
      }

      setFieldValue("degree_proof_file", file);
      if (degreeProofHasBlob) {
        URL.revokeObjectURL(degreeProof);
      }
      setDegreeProof(URL.createObjectURL(file));
      setDegreeProofHasBlob(true);
      setIsSavePage(true);
    };
    return (
      <Form className="space-y-4 flex flex-col items-center">
        <LoadingOverlay loading={isSubmitting} className="rounded-lg"/>
        <Image
          src={degreeProof}
          alt="Proof of Graduation"
          width={500}
          height={300}
          className="w-[500px] h-[300px] border-2 border-gray-50 shadow-sm object-cover"
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
          src={context.state.degreeProofUrl}
          alt="Proof of Graduation"
          width={500}
          height={300}
          className="w-[500px] h-[300px] border-2 border-gray-50 shadow-sm object-cover"
        />
        <div className="absolute bottom-0 right-0 opacity-0 cursor-pointer w-32 h-32 rounded-full"></div>
        <div
          className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-50 rounded-full cursor-pointer"
        >
          <Camera className="text-white" size={16}/>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Proof of Graduation</DialogTitle>
          <DialogDescription>
            This document serves as official verification of your academic achievement and will be used for alumni
            tracking and relations advancement.
          </DialogDescription>
        </DialogHeader>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} component={buildForm}/>
      </DialogContent>
    </Dialog>
  );
}