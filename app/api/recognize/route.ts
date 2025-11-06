import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const prompt = formData.get("prompt") as string;

    if (!imageFile) {
      return NextResponse.json(
        { error: "没有上传图片文件" },
        { status: 400 }
      );
    }

    // 检查 API Key
    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "服务配置错误：缺少 API Key" },
        { status: 500 }
      );
    }

    // 将图片转换为 Base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // 获取图片格式
    const imageType = imageFile.type.split("/")[1]; // 例如: "image/png" -> "png"
    const imageUrl = `data:image/${imageType};base64,${base64Image}`;

    // 准备请求体
    const requestBody = {
      model: "ep-20251105185858-p2z4v",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt || "请详细识别并描述这张图片的内容",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    };

    // 调用火山引擎 API
    const response = await fetch(
      "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("火山引擎 API 错误:", errorText);

      let errorMessage = "图片识别失败";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        // 如果不是 JSON，使用默认错误信息
      }

      return NextResponse.json(
        { error: errorMessage, details: errorText },
        { status: response.status }
      );
    }

    // 获取识别结果
    const result = await response.json();

    // 返回结果
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("处理请求时出错:", error);
    return NextResponse.json(
      {
        error: "服务器内部错误",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}
