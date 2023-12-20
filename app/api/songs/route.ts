import { nextResponseSuccess } from "@/utils/nextResponse.util";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  return nextResponseSuccess({ message: "GET /songs API running." });
};

export const POST = async (request: NextRequest) => {
  return nextResponseSuccess({ message: "POST /songs API running." });
};
