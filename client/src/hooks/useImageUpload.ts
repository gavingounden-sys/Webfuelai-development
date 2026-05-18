import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface UploadProgress {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useImageUpload() {
  const [progress, setProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const uploadMutation = trpc.upload.image.useMutation();

  const uploadImage = async (file: File): Promise<string | null> => {
    // Validate file
    if (!file) {
      setProgress(prev => ({ ...prev, error: "No file selected" }));
      return null;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      const error = "Invalid file type. Please upload JPG, PNG, WebP, or GIF";
      setProgress(prev => ({ ...prev, error }));
      toast.error(error);
      return null;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const error = "File size must be less than 5MB";
      setProgress(prev => ({ ...prev, error }));
      toast.error(error);
      return null;
    }

    setProgress({ isUploading: true, progress: 10, error: null });

    try {
      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      setProgress(prev => ({ ...prev, progress: 40 }));

      // Upload to S3 via tRPC
      const result = await uploadMutation.mutateAsync({
        base64,
        filename: file.name,
        contentType: file.type,
      });

      setProgress({ isUploading: false, progress: 100, error: null });
      return result.url;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      setProgress({ isUploading: false, progress: 0, error: errorMsg });
      toast.error(errorMsg);
      return null;
    }
  };

  return {
    uploadImage,
    ...progress,
  };
}
