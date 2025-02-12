/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUp, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadCardProps {
  uploadedImageUrl: string | null;
  setUploadedImageUrl: (url: string | null) => void;
  setAdditionalInfo: (info: string) => void;
  toast: any;
}

export default function ImageUploadCard({
  uploadedImageUrl,
  setUploadedImageUrl,
  setAdditionalInfo,
  toast,
}: ImageUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadedImageUrl(data.imageUrl);
      toast({
        title: "Image uploaded successfully ✅",
        description: "You can now analyze the image.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error ❌",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedImageUrl) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: uploadedImageUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAdditionalInfo(data.description);
      toast({
        title: "Image analyzed successfully ✅",
        description:
          "Image description has been added to additional information.",
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Error ❌",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      handleImageUpload(file);
      setAdditionalInfo("");
    }
  };

  return (
    <Card
      className={cn(
        "shadow-lg transition-all duration-300",
        isDragging ? "border-purple-500 bg-purple-50" : "hover:shadow-xl"
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageUp className="w-5 h-5" />
          Visual Input
        </CardTitle>
      </CardHeader>
      <CardContent
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 text-center">
          <Input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer block space-y-2"
          >
            <div className="text-purple-600">
              {isDragging
                ? "✨ Drop to upload"
                : "📤 Drag & drop or click to upload"}
            </div>
            {uploadedImageUrl && (
              <Image
                src={uploadedImageUrl || "/placeholder.svg"}
                alt="Uploaded preview"
                height={500}
                width={500}
                className="mt-2 rounded-md max-h-32 object-cover mx-auto"
              />
            )}
          </label>
          {uploadedImageUrl && (
            <Button
              onClick={handleAnalyzeImage}
              disabled={isAnalyzing}
              className="mt-4 w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Image
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
