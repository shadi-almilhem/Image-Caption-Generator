/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ImageIcon } from "lucide-react";
import CustomToggleGroup from "./CustomToggleGroup";

function ImageTypeCard({
  imageTypes,
  selectedImageType,
  setSelectedImageType,
}: any) {
  return (
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
  );
}

export default ImageTypeCard;
