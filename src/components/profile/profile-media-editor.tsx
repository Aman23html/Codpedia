"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ImagePlus,
  Loader2,
  Save,
  ShieldCheck,
  UploadCloud,
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
    <section className="overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--card)]/45 shadow-sm backdrop-blur-xl">
      <div className="relative h-64 bg-[var(--background)]">
        {coverPreview ? (
          <Image
            src={coverPreview}
            alt="Cover image"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/25 via-purple-500/10 to-[var(--background)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-xs font-black uppercase tracking-widest text-white backdrop-blur-xl transition hover:bg-black/60"
        >
          <ImagePlus className="h-4 w-4" />
          Change Cover
        </button>

        <div className="absolute -bottom-16 left-8">
          <div className="group relative h-36 w-36 overflow-hidden rounded-[32px] border-4 border-[var(--background)] bg-[var(--card)] shadow-2xl">
            {profilePreview ? (
              <Image
                src={profilePreview}
                alt="Profile image"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--primary)]/10 text-4xl font-black text-[var(--primary)]">
                {initials || <User className="h-10 w-10" />}
              </div>
            )}

            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
            >
              <Camera className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>

      <form action={handleSubmit} className="px-8 pb-8 pt-24">
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

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Editable Profile
            </div>

            <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">
              {user.fullName}
            </h1>

            <p className="mt-2 text-sm font-semibold text-[var(--muted-foreground)]">
              {user.email}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <ProfilePill label={user.role.replaceAll("_", " ")} />
              <ProfilePill label={user.status.replaceAll("_", " ")} />
              <ProfilePill label={user.department?.name ?? "No Department"} />
              <ProfilePill label={`@${user.username ?? "username"}`} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--foreground)] transition hover:border-[var(--primary)]/40"
            >
              <UploadCloud className="h-4 w-4" />
              Profile Pic
            </button>

            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--foreground)] transition hover:border-[var(--primary)]/40"
            >
              <ImagePlus className="h-4 w-4" />
              Cover Layer
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[var(--primary)]/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
          </div>
        </div>

        {message && (
          <p className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

function ProfilePill({ label }: { label: string }) {
  return (
    <span className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold text-[var(--muted-foreground)]">
      {label}
    </span>
  );
}