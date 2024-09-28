"use client";

import React, { useState, useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2, Sparkles, Copy } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

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
  const [selectedImageType, setSelectedImageType] = useState<string>("");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [generatedCaption, setGeneratedCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleVibeChange = useCallback((value: string[]) => {
    setSelectedVibes(value);
  }, []);

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
    navigator.clipboard.writeText(generatedCaption);
    toast({
      title: "Caption copied to clipboard 🚀",
      description: "You can now paste it anywhere!",
    });
  }, [generatedCaption, toast]);

  const isGenerateDisabled =
    isLoading || selectedVibes.length === 0 || selectedImageType.length === 0;

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Trendy Image Caption Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Image Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              variant="outline"
              type="single"
              value={selectedImageType}
              onValueChange={setSelectedImageType}
              className="flex flex-wrap gap-2"
              aria-label="Select image type"
            >
              {imageTypes.map((type) => (
                <ToggleGroupItem
                  key={type}
                  value={type}
                  className="flex-grow"
                  aria-label={type}
                >
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vibes</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              variant="outline"
              type="multiple"
              value={selectedVibes}
              onValueChange={handleVibeChange}
              className="flex flex-wrap gap-2"
              aria-label="Select vibes"
            >
              {vibes.map((vibe) => (
                <ToggleGroupItem
                  key={vibe}
                  value={vibe}
                  className="flex-grow"
                  aria-label={vibe}
                >
                  {vibe}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>
      </div>
      {generatedCaption && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generated Caption</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="p-4 bg-gray-100 rounded">
              {generatedCaption.replace("*", "")}
            </p>
            <Button
              className="mt-2"
              onClick={handleCopy}
              variant="outline"
              aria-label="Copy caption"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </CardContent>
        </Card>
      )}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Enter additional details"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            aria-label="Additional information"
          />
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleGenerateCaption}
            disabled={isGenerateDisabled}
            className="flex-1"
            aria-label="Generate caption"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Caption
              </>
            )}
          </Button>
        </CardFooter>
        <CardDescription className="mx-auto p-6 pt-0">
          Made By{" "}
          <Link
            className="text-black font-semibold"
            href="https://shadialmilhem.com"
          >
            Shadi Al Milhem
          </Link>
        </CardDescription>
      </Card>

      {error && (
        <Card className="mt-6 border-red-500">
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
