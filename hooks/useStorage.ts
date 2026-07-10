"use client";

import { useState, useCallback } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

// ==================== TYPES ====================

interface UploadProgress {
  progress: number;
  state: "running" | "paused" | "success" | "error" | "canceled";
}

interface UseStorageReturn {
  upload: (file: File, path: string, metadata?: Record<string, any>) => Promise<string>;
  uploadWithProgress: (
    file: File,
    path: string,
    metadata?: Record<string, any>,
    onProgress?: (progress: UploadProgress) => void
  ) => Promise<string>;
  delete: (path: string) => Promise<void>;
  getDownloadURL: (path: string) => Promise<string>;
  uploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
}

// ==================== HOOK ====================

/**
 * Hook for Firebase Storage operations
 */
export function useStorage(): UseStorageReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file to Firebase Storage
   */
  const upload = useCallback(
    async (file: File, path: string, metadata?: Record<string, any>): Promise<string> => {
      try {
        setUploading(true);
        setError(null);
        setProgress({ progress: 0, state: "running" });

        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot: UploadTaskSnapshot) => {
              const progressPercent =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress({
                progress: progressPercent,
                state: snapshot.state,
              });
            },
            (err) => {
              setError(err.message);
              setUploading(false);
              reject(err);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setProgress({ progress: 100, state: "success" });
              setUploading(false);
              resolve(downloadURL);
            }
          );
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        setUploading(false);
        throw new Error(message);
      }
    },
    []
  );

  /**
   * Upload a file with progress callback
   */
  const uploadWithProgress = useCallback(
    async (
      file: File,
      path: string,
      metadata?: Record<string, any>,
      onProgress?: (progress: UploadProgress) => void
    ): Promise<string> => {
      try {
        setUploading(true);
        setError(null);
        setProgress({ progress: 0, state: "running" });

        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot: UploadTaskSnapshot) => {
              const progressPercent =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const progressData = {
                progress: progressPercent,
                state: snapshot.state,
              };
              setProgress(progressData);
              onProgress?.(progressData);
            },
            (err) => {
              setError(err.message);
              setUploading(false);
              reject(err);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const finalProgress = { progress: 100, state: "success" as const };
              setProgress(finalProgress);
              onProgress?.(finalProgress);
              setUploading(false);
              resolve(downloadURL);
            }
          );
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        setUploading(false);
        throw new Error(message);
      }
    },
    []
  );

  /**
   * Delete a file from Firebase Storage
   */
  const deleteFile = useCallback(async (path: string): Promise<void> => {
    try {
      setError(null);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
      throw new Error(message);
    }
  }, []);

  /**
   * Get download URL for a file
   */
  const getFileURL = useCallback(async (path: string): Promise<string> => {
    try {
      setError(null);
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get URL";
      setError(message);
      throw new Error(message);
    }
  }, []);

  return {
    upload,
    uploadWithProgress,
    delete: deleteFile,
    getDownloadURL: getFileURL,
    uploading,
    progress,
    error,
  };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generate a unique file path
 */
export function generateFilePath(
  orgId: string,
  type: "profile" | "product" | "document",
  fileName: string
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = fileName.split(".").pop();

  switch (type) {
    case "profile":
      return `organizations/${orgId}/profiles/${timestamp}-${randomString}.${ext}`;
    case "product":
      return `organizations/${orgId}/products/${timestamp}-${randomString}.${ext}`;
    case "document":
      return `organizations/${orgId}/documents/${timestamp}-${randomString}.${ext}`;
    default:
      return `organizations/${orgId}/misc/${timestamp}-${randomString}.${ext}`;
  }
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}
