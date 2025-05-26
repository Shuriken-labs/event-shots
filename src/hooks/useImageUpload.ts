// hooks/useImageUpload.ts
import { useState } from "react";
import { apiService, UploadResponse } from "@/utils/api";

export interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<UploadResponse | null>;
  uploadImageFromBase64: (
    base64Data: string,
    filename?: string
  ) => Promise<UploadResponse | null>;
  uploading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const uploadImage = async (file: File): Promise<UploadResponse | null> => {
    try {
      setUploading(true);
      setError(null);

      const result = await apiService.uploadImage(file);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadImageFromBase64 = async (
    base64Data: string,
    filename: string = "image.jpg"
  ): Promise<UploadResponse | null> => {
    try {
      setUploading(true);
      setError(null);

      const result = await apiService.uploadImageFromBase64(
        base64Data,
        filename
      );
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploadImageFromBase64,
    uploading,
    error,
    clearError
  };
};
