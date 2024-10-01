import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const client = new Groq();

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in three sentences." },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
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
