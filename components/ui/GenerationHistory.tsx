/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Copy, History } from "lucide-react";
import { Button } from "./button";

function GenerationHistory({ generationHistory, setGeneratedCaption }: any) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Caption History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {generationHistory.map((caption: any, index: any) => (
          <div
            key={index}
            className="p-2 bg-muted rounded flex items-center justify-between"
          >
            <span className="truncate">{caption.replace(/"/g, "")}</span>
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
  );
}

export default GenerationHistory;
