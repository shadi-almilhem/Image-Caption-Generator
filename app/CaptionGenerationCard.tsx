/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  WandSparkles,
  Loader2,
  Sparkles,
  Copy,
  AlertCircle,
} from "lucide-react";
import React from "react";

interface CaptionGenerationCardProps {
  selectedImageType: string;
  selectedVibes: string[];
  additionalInfo: string;
  setAdditionalInfo: (info: string) => void;
  generatedCaption: string;
  setGeneratedCaption: (caption: string) => void;
  addToHistory: (caption: string) => void;
  toast: any;
}

export default function CaptionGenerationCard({
  selectedImageType,
  selectedVibes,
  additionalInfo,
  setAdditionalInfo,
  generatedCaption,
  setGeneratedCaption,
  addToHistory,
  toast,
}: CaptionGenerationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
        title: "Caption Generated!",
        description: "Ready for Instagram stardom!",
      });
    } catch (error) {
      console.error("Error generating caption:", error);
      setError("Failed to generate caption. Please try again.");
      toast({
        title: "Generation Failed",
        description: "Failed to generate caption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
      setIsLoading(false);
    }
  }, [
    selectedImageType,
    selectedVibes,
    additionalInfo,
    addToHistory,
    setGeneratedCaption,
    toast,
  ]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCaption.replace(/"/g, ""));
    toast({
      title: "Caption copied to clipboard 🚀",
      description: "You can now paste it anywhere!",
    });
  }, [generatedCaption, toast]);

  const CaptionPreview = React.memo(({ caption }: { caption: string }) => {
    const emojiRegex =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    const match = caption.match(emojiRegex);
    const emoji = match ? match[match.length - 1] : "";
    const text = match ? caption.slice(0, -emoji.length) : caption;

    return (
      <div className="p-4 bg-linear-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100 transition-all duration-300 ease-in-out opacity-100 transform translate-y-0">
        {text && <span className="text-lg font-medium">{text.trim()}</span>}
      </div>
    );
  });

  CaptionPreview.displayName = "CaptionPreview";

  return (
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
            <div className="transition-all duration-300 ease-in-out">
              {generatedCaption ? (
                <CaptionPreview caption={generatedCaption} />
              ) : (
                <PlaceholderContent />
              )}
            </div>
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
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-6 text-lg font-medium transition-all hover:shadow-lg duration-300"
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

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 transition-all duration-300 ease-in-out opacity-100 transform translate-y-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="font-medium text-red-600">Optimization Error</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

const PlaceholderContent = React.memo(() => (
  <div className="h-32 flex items-center justify-center text-muted-foreground bg-muted/50 rounded-lg transition-all duration-300 ease-in-out opacity-100">
    Your masterpiece caption will appear here...
  </div>
));

PlaceholderContent.displayName = "PlaceholderContent";
