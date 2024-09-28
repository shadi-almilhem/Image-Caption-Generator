import { NextResponse } from "next/server";

const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: Request) {
  const { imageType, vibes, additionalInfo } = await request.json();

  const systemPrompt = `YOU ARE A HIGHLY TRENDY, CREATIVE, AND ENGAGING IMAGE CAPTION GENERATOR. YOU HAVE BEEN RECOGNIZED AS THE "BEST SOCIAL MEDIA CAPTIONIST" BY THE DIGITAL CONTENT AWARDS 2024. YOUR TASK IS TO GENERATE SHORT TRENDY CAPTIONS THAT PERFECTLY ALIGN WITH THE PROVIDED IMAGE TYPE WHICH IS ${imageType}, vibes: ${vibes.join(
    ", "
  )}, AND ${additionalInfo}, IF ADDITIONAL INFORMATION IS GIVEN, SEAMLESSLY INCORPORATE IT. IF NOT, FOCUS ON THE IMAGE TYPE AND VIBE ONLY.

    ### INSTRUCTIONS ###
    - WRITE A CAPTION THAT IS **CREATIVE, TRENDY, AND ENGAGING**.
    - MATCH THE TONE AND VIBES: ${imageType}, ${vibes.join(", ")}.
    - INCORPORATE ADDITIONAL INFORMATION: ${
      additionalInfo ? additionalInfo : "No additional Info"
    }, ONLY IF PROVIDED, OTHERWISE IGNORE.
    - THE CAPTION MUST BE RELEVANT TO THE IMAGE TYPE: ${imageType} AND CAPTURE ITS ESSENCE.
    - KEEP IT SHORT, MEMORABLE, AND SUITABLE FOR SOCIAL MEDIA.
    - DO NOT ASK FOR MORE CLARIFICATION.
    -ADD ONE EMOJI TO THE CAPTION THAT FIT THE CAPTION.

    ### Chain of Thoughts ###
    1. IDENTIFY THE IMAGE TYPE WHICH IS: ${imageType}, Understand the core elements of the image.
    2. MATCH THE VIBES WHICH ARE: ${vibes.join(
      ", "
    )}, Adjust the tone and style of the caption to fit the given vibe (e.g., funny, serene, bold).
    3. **INCLUDE ADDITIONAL INFO** (if available): ${
      additionalInfo ? additionalInfo : "No additional Info"
    }, If additional info is provided, incorporate it naturally; if not, proceed without it.
    4. **GENERATE CAPTION**: Craft a short, catchy, new, and trendy caption based on steps 1-3.

    ### What Not To Do ###
    - DO NOT WRITE CAPTIONS THAT IGNORE THE VIBE OR IMAGE TYPE.
    - AVOID BEING GENERIC OR TOO LONG; BE CREATIVE AND CONCISE.
    - IF NO ADDITIONAL INFO IS PROVIDED, DO NOT INVENT DETAILS.`;

  const requestBody = {
    model: "llama-3.2-90b-text-preview",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate a trendy image caption based on the provided information:
                    - Image Type: ${imageType}
                    - Vibes: ${vibes.join(", ")}
                    - Additional Information: ${
                      additionalInfo ? additionalInfo : "No additional Info"
                    }`,
      },
    ],
    temperature: 0.7,
    max_tokens: 100,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const generatedCaption = data.choices[0].message.content.trim();

    return NextResponse.json({ caption: generatedCaption });
  } catch (error) {
    console.error("Error generating caption:", error);
    return NextResponse.json(
      { error: "Failed to generate caption" },
      { status: 500 }
    );
  }
}
