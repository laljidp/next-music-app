import { NextResponse } from "next/server";

export const nextResponseSuccess = (data: any) => {
  return NextResponse.json({ ...data, success: true }, { status: 200 });
};

export const nextResponseError = (message: string, status: number) => {
  return NextResponse.json({ message, success: false }, { status });
};
