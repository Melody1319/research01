import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size = "2K" } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "缺少提示词" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API Key 未配置" },
        { status: 500 }
      );
    }

    // 调用火山引擎图片生成 API
    const requestBody = {
      model: "ep-20251106164205-c8bgh",
      prompt: prompt,
      sequential_image_generation: "disabled",
      response_format: "url",
      size: size,
      stream: false,
      watermark: true,
    };

    console.log("Calling Volcano Engine API with:", requestBody);

    const response = await fetch(
      "https://ark.cn-beijing.volces.com/api/v3/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: `API 请求失败: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("API Response:", result);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Generate image error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "生成图片失败",
      },
      { status: 500 }
    );
  }
}
