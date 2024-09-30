import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const client = new Groq();

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("image") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64Image = buffer.toString("base64");

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in three sentences." },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview",
    });

    const imageDescription = chatCompletion.choices[0].message.content || "";
    return NextResponse.json({ description: imageDescription });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
