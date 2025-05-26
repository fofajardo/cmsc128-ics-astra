"use client";

import PersonalInfoModal from "@/components/profile/modals/PersonalInfoModal.jsx";
import {CIVIL_STATUS_LABELS, SEX_LABELS} from "../../../../common/scopes.js";
import nationalities from "i18n-nationality";
import {BadgeCheckIcon, BadgeXIcon, Camera, ClipboardCheck, ShieldUserIcon} from "lucide-react";
import React from "react";
import {Badge} from "@/components/ui/badge.jsx";
import ProfilePictureModal from "@/components/profile/modals/ProfilePictureModal.jsx";
import AddressModal from "@/components/profile/modals/AddressModal.jsx";

export function PersonalInfo({context}) {
  if (!context.state.profile) {
    return null;
  }

  const profileData = {
    FirstName: context.state.profile.first_name,
    MiddleName: context.state.profile.middle_name,
    LastName: context.state.profile.last_name,
    Title: context.state.profile.honorifics,
    Suffix: context.state.profile.suffix ? context.state.profile.suffix : "-",
    Gender: context.state.profile.gender,
    SexAssignedAtBirth: SEX_LABELS[context.state.profile.sex],
    BirthDate: context.state.profile.birthdate,
    Address: context.state.profile.address,
    Citizenship: nationalities.getName(context.state.profile.citizenship, "en"),
    CivilStatus: CIVIL_STATUS_LABELS[context.state.profile.civil_status],
    StudentNumber: context.state.profile.student_num,
  };

  const addressData = {
    GeneralLocation: context.state.profile.location,
    Address: context.state.profile.address,
  };

  return (
    <>
      <section className="bg-white rounded-lg p-8 mb-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 items-center text-center">
          <div className="flex w-[128px]">
            <div className="flex justify-center w-full relative">
              <ProfilePictureModal context={context} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl md:text-3xl font-semibold text-[var(--color-astrablack)]">
              {profileData.FirstName} {profileData.LastName}
            </h2>
            <Badge className="text-md" variant="none">
              <div>
                {
                  context.state.isAdmin &&
                      <ShieldUserIcon size={18} />
                }
                {
                  context.state.isModerator &&
                      <ClipboardCheck size={18} />
                }
                {
                  context.state.isAlumnus && context.state.isVerified
                    ? <BadgeCheckIcon size={18} />
                    : <BadgeXIcon size={18} />
                }
              </div>

              {
                context.state.isAlumnus && context.state.isVerified
                  ? "Verified "
                  : "Unconfirmed "
              }
              {context.state.roleFriendlyName}
            </Badge>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg p-8 mb-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-5">

          <div className="flex-1">
            <div className="flex justify-between gap-4 items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">
                Personal Information
              </h2>
              {context.state.isVerified && (
                <PersonalInfoModal context={context} />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
              {Object.entries(profileData)
                .map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, " $1");
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

      <section className="bg-white rounded-lg p-8 mb-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-5">

          <div className="flex-1">
            <div className="flex justify-between gap-4 items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-astrablack)]">
                Address
              </h2>
              {context.state.isVerified && (
                <AddressModal context={context} />
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 md:gap-5">
              {Object.entries(addressData)
                .map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, " $1");
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
    </>
  );
}