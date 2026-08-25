"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ImagePlus,
  Loader2,
  Save,
  User,
} from "lucide-react";

import { updateProfileMedia } from "@/actions/profile/update-profile-media";

type ProfileUser = {
  fullName: string;
  username: string | null;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  department: {
    name: string;
    type: string;
  } | null;
};

export default function ProfileMediaEditor({ user }: { user: ProfileUser }) {
  const router = useRouter();

  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(
    user.profileImageUrl
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    user.coverImageUrl
  );

  function handlePreview(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "profile") {
      setProfilePreview(preview);
    } else {
      setCoverPreview(preview);
    }
  }

  function handleSubmit(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      try {
        const result = await updateProfileMedia(formData);
        setMessage(result.message);
        router.refresh();
      } catch (error: any) {
        setMessage(error.message || "Failed to update profile media.");
      }
    });
  }

  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <form 
      action={handleSubmit} 
      className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm"
    >
      {/* Hidden File Inputs */}
      <input
        ref={profileInputRef}
        type="file"
        name="profileImage"
        accept="image/*"
        className="hidden"
        onChange={(event) => handlePreview(event, "profile")}
      />
      <input
        ref={coverInputRef}
        type="file"
        name="coverImage"
        accept="image/*"
        className="hidden"
        onChange={(event) => handlePreview(event, "cover")}
      />

      {/* ========================================== */}
      {/* 1. COVER IMAGE AREA                        */}
      {/* ========================================== */}
      <div className="group relative h-32 w-full bg-[var(--background)] sm:h-40">
        {coverPreview ? (
          <Image
            src={coverPreview}
            alt="Cover image"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 via-purple-500/10 to-[var(--background)]" />
        )}
        
        {/* Dark overlay for better button contrast on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />

        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="absolute right-4 top-4 inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/20 bg-black/40 px-3 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/60 sm:right-5 sm:top-5"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Edit Cover
        </button>
      </div>

      {/* ========================================== */}
      {/* 2. AVATAR & ACTIONS AREA                   */}
      {/* ========================================== */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          
          <div className="relative z-10 -mt-10 flex flex-col gap-3 sm:-mt-12 sm:flex-row sm:items-end sm:gap-4">
            {/* Avatar Container */}
            <div className="group/avatar relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-[var(--card)] bg-[var(--background)] shadow-sm sm:h-24 sm:w-24">
              {profilePreview ? (
                <Image
                  src={profilePreview}
                  alt="Profile image"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--primary)]/10 text-xl font-bold text-[var(--primary)] sm:text-2xl">
                  {initials || <User className="h-8 w-8" />}
                </div>
              )}

              {/* Avatar Hover Action */}
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover/avatar:opacity-100"
              >
                <Camera className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex flex-col pb-1">
              <h1 className="text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
                {user.fullName}
              </h1>
              <p className="text-[13px] font-medium text-[var(--muted-foreground)]">
                {user.email}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3">
            {message && (
              <span className="text-[12px] font-medium text-[var(--foreground)]">
                {message}
              </span>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-[13px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 sm:w-auto"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save Media
            </button>
          </div>
          
        </div>
      </div>
    </form>
  );
}