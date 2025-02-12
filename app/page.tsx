"use client";
import { useState, useCallback } from "react";
import { useToast } from "@/components/hooks/use-toast";
import Header from "@/components/ui/Header";

import Footer from "@/components/ui/Footer";
import { imageTypes, vibes } from "@/lib/constants";
import ImageTypeCard from "@/components/ui/ImageTypeCard";
import ImageVibeCard from "@/components/ui/ImageVibeCard";
import ImageUploadCard from "./ImageUploadCard";
import GenerationHistory from "@/components/ui/GenerationHistory";
import CaptionGenerationCard from "./CaptionGenerationCard";

export default function Home() {
  const [selectedImageType, setSelectedImageType] = useState("");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const addToHistory = useCallback((caption: string) => {
    setGenerationHistory((prev) => [caption, ...prev.slice(0, 4)]);
  }, []);

  return (
    <div className="container p-4 pb-10 max-w-6xl mx-auto min-h-screen">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ImageTypeCard
            imageTypes={imageTypes}
            selectedImageType={selectedImageType}
            setSelectedImageType={setSelectedImageType}
          />
          <ImageVibeCard
            vibes={vibes}
            selectedVibes={selectedVibes}
            setSelectedVibes={setSelectedVibes}
          />
        </div>

        <div className="space-y-6">
          <ImageUploadCard
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setAdditionalInfo={setAdditionalInfo}
            toast={toast}
          />
          {generationHistory.length > 0 && (
            <GenerationHistory
              generationHistory={generationHistory}
              setGeneratedCaption={setGeneratedCaption}
            />
          )}
        </div>
      </div>

      <CaptionGenerationCard
        selectedImageType={selectedImageType}
        selectedVibes={selectedVibes}
        additionalInfo={additionalInfo}
        setAdditionalInfo={setAdditionalInfo}
        generatedCaption={generatedCaption}
        setGeneratedCaption={setGeneratedCaption}
        addToHistory={addToHistory}
        toast={toast}
      />

      <Footer />
    </div>
  );
}
