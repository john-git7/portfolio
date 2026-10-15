import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio-data";
import { PortfolioData } from "@/types/portfolio";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: PortfolioData = await request.json();
    
    if (!body || !body.profile || !body.resume || !Array.isArray(body.socialLinks)) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    const saved = await savePortfolioData(body);
    if (!saved) {
      return NextResponse.json({ error: "Failed to save portfolio data" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error("Error in POST /api/portfolio:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
