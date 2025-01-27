"use client";
import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/hooks/use-toast";
import { Playfair_Display_SC } from "next/font/google";
import {
  Loader2,
  Sparkles,
  Copy,
  ImageIcon,
  Palette,
  ImageUp,
  WandSparkles,
  History,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
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
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const instrument = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
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
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isLoading]);
  const addToHistory = (caption: string) => {
    setGenerationHistory((prev) => [caption, ...prev.slice(0, 4)]);
  };
  const handleImageUpload = async (file: File) => {
    setError(null);

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
      setError("Failed to upload image. Please try again.");
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
    setError(null);

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
    setProgress(0);
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
      addToHistory(data.caption);

      toast({
        title: (
          <span className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Caption Generated!
          </span>
        ),
        description: "Ready for Instagram stardom!",
      });
    } catch (error) {
      console.error("Error generating caption:", error);
      setError("Failed to generate caption. Please try again.");
      toast({
        title: (
          <span className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Generation Failed
          </span>
        ),
        description: "Failed to generate caption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
      setIsLoading(false);
    }
  }, [selectedImageType, selectedVibes, additionalInfo, toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      handleImageUpload(file);
      setAdditionalInfo("");
    }
  };
  const emojiRegex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  const CaptionPreview = ({ caption }: { caption: string }) => {
    const match = caption.match(emojiRegex);
    const emoji = match ? match[match.length - 1] : "";
    const text = match ? caption.slice(0, -emoji.length) : caption;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100"
      >
        {text && <span className="text-lg font-medium">{text.trim()}</span>}
        {emoji && <span className="ml-2 text-2xl">{emoji}</span>}
      </motion.div>
    );
  };
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCaption.replace(/"/g, ""));
    toast({
      title: "Caption copied to clipboard 🚀",
      description: "You can now paste it anywhere!",
    });
  }, [generatedCaption, toast]);

  return (
    <div className="container p- pb-10 max-w-6xl mx-auto min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          <span
            className={`${instrument.className} bg-gradient-to-r to-purple-700 from-indigo-600 
            text-transparent bg-clip-text px-1 antialiased block`}
          >
            CAPTIVATE
          </span>
        </h1>
        <p className="text-muted-foreground">
          AI-Powered Instagram Caption Engine
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Type Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Visual Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomToggleGroup
                options={imageTypes}
                value={selectedImageType}
                onChange={setSelectedImageType}
                className="max-h-64 overflow-y-auto grid grid-cols-2 gap-2"
              />
            </CardContent>
          </Card>

          {/* Vibes Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Mood Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomToggleGroup
                options={vibes}
                value={selectedVibes}
                onChange={setSelectedVibes}
                multiple={true}
                className="max-h-64 overflow-y-auto grid grid-cols-2 gap-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Image Upload Card */}
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

          {/* Generation History */}
          {generationHistory.length > 0 && (
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Caption History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {generationHistory.map((caption, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted rounded flex items-center justify-between"
                  >
                    <span className="truncate">
                      {caption.replace(/"/g, "")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setGeneratedCaption(caption)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Generation Section */}
      <Card className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WandSparkles className="w-5 h-5" />
            Caption Crafting Studio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-purple-600">⚡ Live Analysis</span>
                <Badge variant="outline" className="ml-auto">
                  {selectedVibes.length} Vibes Selected
                </Badge>
              </div>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Image context will appear here..."
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-purple-600">✨ Preview</span>
                {generatedCaption && (
                  <Badge variant="secondary" className="ml-auto">
                    {generatedCaption.split(" ").length} words
                  </Badge>
                )}
              </div>
              <AnimatePresence mode="wait">
                {generatedCaption ? (
                  <CaptionPreview caption={generatedCaption} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-32 flex items-center justify-center text-muted-foreground bg-muted/50 rounded-lg"
                  >
                    Your masterpiece caption will appear here...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Engineering virality...</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleGenerateCaption}
                disabled={
                  isLoading ||
                  selectedVibes.length === 0 ||
                  selectedImageType.length === 0
                }
                className="flex-1 py-6 text-lg font-medium transition-all hover:scale-[1.01]"
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
              {generatedCaption && (
                <Button
                  onClick={handleCopy}
                  className="py-6 text-lg font-medium transition-all hover:scale-[1.02]"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error handling */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-600">Optimization Error</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardFooter className="mt-6 justify-center">
        <CardDescription className="text-center p-2">
          Created by{" "}
          <Link
            className="text-purple-600 font-semibold hover:underline"
            href="https://shadialmilhem.com"
          >
            Shadi Al Milhem
          </Link>
        </CardDescription>
      </CardFooter>
    </div>
  );
}
