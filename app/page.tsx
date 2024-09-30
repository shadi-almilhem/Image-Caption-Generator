"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2, Sparkles, Copy, Camera, Zap } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import CustomToggleGroup from "@/components/ui/CustomToggleGroup";

const imageTypes = [
  "Adventure Sports",
  "Architecture",
  "Art",
  "Automotive",
  "Business",
  "City",
  "Culture",
  "Education",
  "Events",
  "Fashion",
  "Fitness",
  "Food",
  "Gaming",
  "Health",
  "History",
  "Home Decor",
  "Music",
  "Nature",
  "Personal",
  "Pets",
  "Space",
  "Sports",
  "Technology",
  "Travel",
  "Wildlife",
];

const vibes = [
  "Adventurous",
  "Bold",
  "Calm",
  "Cool",
  "Curious",
  "Dramatic",
  "Elegant",
  "Energetic",
  "Excited",
  "Funny",
  "Futuristic",
  "Gritty",
  "Happy",
  "Inspirational",
  "Intense",
  "Luxurious",
  "Majestic",
  "Minimalist",
  "Mysterious",
  "Nostalgic",
  "Peaceful",
  "Playful",
  "Quirky",
  "Relaxed",
  "Romantic",
  "Rustic",
  "Sad",
  "Sophisticated",
  "Surreal",
  "Tranquil",
  "Warm",
  "Whimsical",
  "Wow",
];

export default function Home() {
  const [selectedImageType, setSelectedImageType] = useState("");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { toast } = useToast();
  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
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
      setError("Failed to analyze image. Please try again.");
      toast({
        title: "Error ❌",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleGenerateCaption = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageType: selectedImageType,
          vibes: selectedVibes,
          additionalInfo,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedCaption(data.caption);
      toast({
        title: "Caption generated successfully ✅",
        description: "Your caption is ready!",
      });
    } catch (error) {
      console.error("Error generating caption:", error);
      setError("Failed to generate caption. Please try again.");
      toast({
        title: "Error ❌",
        description: "Failed to generate caption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedImageType, selectedVibes, additionalInfo, toast]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setAdditionalInfo(""); // Clear previous additional info
    }
  };
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCaption.replace(/"/g, ""));
    toast({
      title: "Caption copied to clipboard 🚀",
      description: "You can now paste it anywhere!",
    });
  }, [generatedCaption, toast]);

  return (
    <div className="container p-6 max-w-6xl mx-auto   min-h-screen">
      <h1 className="text-4xl text-purple-800 font-bold mb-6 text-center">
        Image Caption Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-purple-700 font-semibold flex items-center">
              <Camera className="mr-2" /> Image Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomToggleGroup
              options={imageTypes}
              value={selectedImageType}
              onChange={setSelectedImageType}
              className="max-h-64 overflow-y-auto"
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-purple-700 font-semibold flex items-center">
              <Zap className="mr-2" /> Vibes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomToggleGroup
              options={vibes}
              value={selectedVibes}
              onChange={setSelectedVibes}
              multiple={true}
              className="max-h-64 overflow-y-auto"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-purple-700 font-semibold flex items-center">
            <Camera className="mr-2" /> Upload and Analyze Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            aria-label="Upload image"
            className="border-purple-200 focus:border-purple-500 mb-4"
          />
          <Button
            onClick={handleAnalyzeImage}
            disabled={!selectedImage || isAnalyzing}
            className="w-full bg-purple-500 py-5 hover:bg-purple-600 text-white"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Analyze Image
              </>
            )}
          </Button>
        </CardContent>
        <CardHeader>
          <CardTitle className="text-purple-700 font-semibold">
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Image description will appear here after analysis. You can also add or edit additional details."
            className="w-full h-32 p-2 border border-purple-200 rounded focus:border-purple-500"
          />
        </CardContent>
      </Card>

      <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-purple-700 font-semibold">
            Generate Caption
          </CardTitle>
        </CardHeader>
        {generatedCaption && (
          <CardContent>
            <p className="p-4 bg-purple-50 rounded-lg text-gray-800 font-medium">
              {generatedCaption.replace(/"/g, "")}
            </p>
            <Button
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white"
              onClick={handleCopy}
              aria-label="Copy caption"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </CardContent>
        )}
        <CardContent>
          <Button
            onClick={handleGenerateCaption}
            disabled={
              isLoading ||
              selectedVibes.length === 0 ||
              selectedImageType.length === 0
            }
            className="w-full bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:bg-gradient-to-b shadow-[inset_0px_-2px_0px_0px_rgba(0,_0,_0,_0.1),_inset_0px_2px_0px_0px_rgba(255,_255,_255,_0.3)] text-white transition-colors duration-300 py-5"
            aria-label="Generate caption"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Caption
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mt-6 border-red-500 bg-red-50">
          <CardContent>
            <p className="text-red-600 font-medium">{error}</p>
          </CardContent>
        </Card>
      )}
      <CardDescription className="text-center p-2">
        Created by{" "}
        <Link
          className="text-purple-600 font-semibold hover:underline"
          href="https://shadialmilhem.com"
        >
          Shadi Al Milhem
        </Link>
      </CardDescription>
    </div>
  );
}
