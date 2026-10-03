"use client";

import { useState } from "react";
import {
  UploadCloud,
  Loader2,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  getCloudinarySignature,
  deleteCloudinaryImageAction,
} from "@/app/actions/parts";
import { Badge } from "@/components/ui/Badge";

export interface ImageItem {
  url: string;
  publicId: string;
}

interface CloudinaryMultiUploadProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  folder: string;
}

export function CloudinaryMultiUpload({
  images,
  onChange,
  folder,
}: CloudinaryMultiUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image file`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 5MB limit`);
        return;
      }
      validFiles.push(file);
    }

    setIsUploading(true);
    setError("");

    const newUploaded: ImageItem[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress(`Uploading ${i + 1}/${validFiles.length}...`);

        const { timestamp, signature, cloudName, apiKey } =
          await getCloudinarySignature(folder);
        const effectiveCloudName =
          cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

        if (!effectiveCloudName) {
          throw new Error(
            "Cloudinary cloud_name missing in environment configuration.",
          );
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "api_key",
          (apiKey || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)!,
        );
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${effectiveCloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error?.message || `Upload failed for ${file.name}`,
          );
        }

        newUploaded.push({
          url: data.secure_url,
          publicId: data.public_id,
        });
      }

      onChange([...images, ...newUploaded]);
    } catch (err: any) {
      setError(err.message || "Failed to upload image(s)");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      e.target.value = "";
    }
  };

  const handleRemove = async (index: number) => {
    const itemToRemove = images[index];
    const nextImages = images.filter((_, i) => i !== index);
    onChange(nextImages);

    if (itemToRemove.publicId) {
      try {
        await deleteCloudinaryImageAction(itemToRemove.publicId);
      } catch (err) {
        console.error("Failed to delete Cloudinary asset:", err);
      }
    }
  };

  const handleMakeMain = (index: number) => {
    if (index === 0 || index >= images.length) return;
    const item = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([item, ...remaining]);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const nextImages = [...images];
    const temp = nextImages[index];
    nextImages[index] = nextImages[targetIndex];
    nextImages[targetIndex] = temp;
    onChange(nextImages);
  };

  return (
    <div className="w-full space-y-3">
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}

      {/* Header Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground-muted">
          1st photo is shown in the listing page
        </span>
        <span className="font-mono text-[11px] text-muted-foreground/80">
          {images.length} {images.length === 1 ? "photo" : "photos"}
        </span>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {images.map((item, idx) => {
          const isMain = idx === 0;
          return (
            <div
              key={item.url + idx}
              className={`group relative aspect-square overflow-hidden rounded-xl border transition-all ${
                isMain
                  ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                  : "border-border/70 bg-card hover:border-border"
              }`}
            >
              {/* Thumbnail Image */}
              {}
              <img
                src={item.url}
                alt={`Photo ${idx + 1}`}
                className="h-full w-full object-contain p-2 transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />

              {/* Top-Left Badge */}
              <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
                {isMain ? (
                  <Badge
                    variant="default"
                    className="text-[10px] px-1.5 py-0.2 gap-1 bg-primary text-primary-foreground font-semibold shadow-xs"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    Main
                  </Badge>
                ) : (
                  <span className="rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] px-1.5 py-0.5 font-mono">
                    #{idx + 1}
                  </span>
                )}
              </div>

              {/* Clean Hover Controls Overlay */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs md:opacity-0 transition-opacity duration-200 md:group-hover:opacity-100 flex flex-col items-center justify-center gap-2 p-2 z-20">
                <div className="flex items-center gap-1.5">
                  {!isMain && (
                    <button
                      type="button"
                      onClick={() => handleMakeMain(idx)}
                      disabled={isUploading}
                      className="flex h-8 items-center gap-1 rounded-lg bg-amber-500 text-black px-2 text-[11px] font-bold shadow-md hover:bg-amber-400 transition-all hover:scale-105"
                      title="Set as Main Listing Image"
                    >
                      <Star className="h-3.5 w-3.5 fill-black" />
                      Set Main
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0 || isUploading}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-all"
                    title="Move Left"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === images.length - 1 || isUploading}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 transition-all"
                    title="Move Right"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    disabled={isUploading}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Upload Trigger Box */}
        <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-2 text-center transition-colors hover:border-primary/50 hover:bg-accent/30">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
            {images.length > 0 ? (
              <Plus className="h-5 w-5" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>
          <span className="text-xs font-semibold text-foreground">
            {images.length > 0 ? "Add More" : "Upload Photos"}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Multiple allowed
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            disabled={isUploading}
          />
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-background/90 backdrop-blur-xs z-30">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-[11px] font-medium text-foreground">
                {uploadProgress || "Uploading..."}
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
