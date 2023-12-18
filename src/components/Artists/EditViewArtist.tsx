import React from "react";
import { TWButton } from "@/components/UI/Button";
import ImageUpload from "@/components/UI/ImageUpload";
import TWInput from "@/components/UI/Input";
import TWTextArea from "@/components/UI/Input/textrea.input";
import SelectMultiple from "@/components/UI/SelectMultiple";
import { GENRES } from "@/services/types/artists.types";

interface EditViewArtistProps {}

export default function EditViewArtist(props: EditViewArtistProps) {
  return (
    <div className="flex w-[100%] flex-col justify-center gap-5">
      <ImageUpload
        name="artist-image"
        text="Upload Image"
        onChange={(file) => {
          console.log(file);
        }}
      />
      <TWInput
        onChange={({ currentTarget }) => console.log(currentTarget.value)}
        name="artist"
        placeholder="Artist name"
        label={"Artist Name"}
      />
      <TWTextArea
        onChange={({ currentTarget }) => console.log(currentTarget.value)}
        name="artist"
        placeholder="Bio"
        label={"Bio"}
      />
      <SelectMultiple
        options={GENRES.map((genre) => ({ name: genre, value: genre }))}
        placeholder="Select Genre"
        selected={["Rock"]}
        onSelect={console.log}
      />
      <TWButton className="w-[145px]">Save</TWButton>
    </div>
  );
}
