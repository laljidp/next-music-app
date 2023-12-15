"use client";
import { TWButton } from "@/components/UI/Button";
import Spinner from "@/components/UI/Spinner";

export default function ButtonContainer() {
  return (
    <div className="flex flex-wrap gap-10 border-1 border-solid">
      <div className="flex flex-col gap-5">
        <div className="border-1 border-solid">
          <TWButton>Primary</TWButton> <br />
          <TWButton loading>Loading</TWButton>
        </div>
        <div>
          <TWButton variant="secondary">Secondary</TWButton>
        </div>
        <div>
          <TWButton variant="outline">Outline</TWButton>
        </div>
      </div>
      <div className="flex flex-col gap-5" id="spinner-section">
        <Spinner color="default" />
        <Spinner color="violet" />
        <Spinner color="slate" />
        <Spinner color="emerald" />
      </div>
    </div>
  );
}
