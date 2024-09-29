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
  CardFooter,
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
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleGenerateCaption = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCaption.replace(/"/g, ""));
    toast({
      title: "Caption copied to clipboard 🚀",
      description: "You can now paste it anywhere!",
    });
  }, [generatedCaption, toast]);

  const isGenerateDisabled =
    isLoading || selectedVibes.length === 0 || selectedImageType.length === 0;

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

      {generatedCaption && (
        <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-purple-600 font-semibold">
              Generated Caption
            </CardTitle>
          </CardHeader>
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
        </Card>
      )}

      <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-purple-700 font-semibold">
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Enter additional details to refine your caption"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            aria-label="Additional information"
            className="border-purple-200 focus:border-purple-500"
          />
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleGenerateCaption}
            disabled={isGenerateDisabled}
            className="w-full bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-600  hover:to-purple-700 hover:bg-gradient-to-b   text-white transition-colors duration-300"
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
        </CardFooter>
        <CardDescription className="text-center pb-2">
          Created by{" "}
          <Link
            className="text-purple-600 font-semibold hover:underline"
            href="https://shadialmilhem.com"
          >
            Shadi Al Milhem
          </Link>
        </CardDescription>
      </Card>

      {error && (
        <Card className="mt-6 border-red-500 bg-red-50">
          <CardContent>
            <p className="text-red-600 font-medium">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
