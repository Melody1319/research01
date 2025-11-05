import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "没有上传图片文件" },
        { status: 400 }
      );
    }

    // 检查 API Key
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "服务配置错误：缺少 API Key" },
        { status: 500 }
      );
    }

    // 准备发送到 remove.bg 的表单数据
    const removeBgFormData = new FormData();
    removeBgFormData.append("image_file", imageFile);
    removeBgFormData.append("size", "auto");

    // 调用 remove.bg API
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remove.bg API 错误:", errorText);

      // 解析错误信息
      let errorMessage = "去除背景失败";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.errors?.[0]?.title || errorMessage;
      } catch (e) {
        // 如果不是 JSON，使用默认错误信息
      }

      return NextResponse.json(
        { error: errorMessage, details: errorText },
        { status: response.status }
      );
    }

    // 获取处理后的图片
    const imageBlob = await response.blob();

    // 返回图片数据
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
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
