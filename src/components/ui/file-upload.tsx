"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileIcon } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  onFile: (file: File) => void;
  currentUrl?: string | null;
  label?: string;
  error?: string;
  className?: string;
}

export function FileUpload({
  accept,
  maxSizeMB = 5,
  onFile,
  currentUrl,
  label,
  error,
  className,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = accept?.includes("image");

  const handleFile = (file: File) => {
    setSizeError("");
    if (file.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`File must be under ${maxSizeMB}MB`);
      return;
    }
    setFileName(file.name);
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    onFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const displayUrl = preview || currentUrl;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="block text-[13px] font-semibold text-foreground/70 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30",
          error && "border-danger/50",
        )}
      >
        {displayUrl && isImage ? (
          <div className="relative">
            <img src={displayUrl} alt="Preview" className="h-20 w-20 rounded-xl object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                setFileName(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-foreground text-white flex items-center justify-center hover:bg-danger transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : fileName ? (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <FileIcon className="h-5 w-5 text-primary" />
            <span className="truncate max-w-[200px]">{fileName}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-muted hover:text-danger"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted mb-2" />
            <p className="text-sm text-muted">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted/60 mt-1">Max {maxSizeMB}MB</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
        />
      </div>
      {(error || sizeError) && <p className="text-xs font-medium text-danger">{error || sizeError}</p>}
    </div>
  );
}
