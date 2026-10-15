import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio-data";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed for resume upload" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save as public/John_Ebenezer_CV.pdf (primary active resume file)
    const publicDir = path.join(process.cwd(), "public");
    const primaryFilePath = path.join(publicDir, "John_Ebenezer_CV.pdf");
    await fs.writeFile(primaryFilePath, buffer);

    // Also keep an archive copy in public/uploads/
    const uploadsDir = path.join(publicDir, "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const archiveFileName = `resume-${Date.now()}-${safeName}`;
    const archiveFilePath = path.join(uploadsDir, archiveFileName);
    await fs.writeFile(archiveFilePath, buffer);

    // Format file size
    const sizeInKb = (file.size / 1024).toFixed(0);
    const fileSizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
      : `${sizeInKb} KB`;

    // Update portfolio-content.json
    const portfolioData = await getPortfolioData();
    portfolioData.resume = {
      url: `/John_Ebenezer_CV.pdf`,
      filename: file.name,
      label: portfolioData.resume.label || "Resume",
      fileSize: fileSizeFormatted,
      lastUpdated: new Date().toISOString(),
    };

    await savePortfolioData(portfolioData);

    return NextResponse.json({
      success: true,
      resume: portfolioData.resume,
      message: "Resume successfully uploaded and updated!",
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Failed to upload resume. Please check file permissions or try again." },
      { status: 500 }
    );
  }
}
