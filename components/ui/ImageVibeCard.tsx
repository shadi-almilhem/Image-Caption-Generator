/* eslint-disable @typescript-eslint/no-explicit-any */
import { Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import CustomToggleGroup from "./CustomToggleGroup";

function ImageVibeCard({ vibes, selectedVibes, setSelectedVibes }: any) {
  return (
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
  );
}

export default ImageVibeCard;
