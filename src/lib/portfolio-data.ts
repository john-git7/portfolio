import fs from "fs/promises";
import path from "path";
import { PortfolioData } from "@/types/portfolio";
import defaultData from "@/data/portfolio-content.json";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolio-content.json");

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(raw) as PortfolioData;
  } catch (error) {
    console.warn("Could not read portfolio-content.json, using default:", error);
    return defaultData as PortfolioData;
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to write to portfolio-content.json:", error);
    return false;
  }
}
