import { ISongsDto } from "@/services/types/songs.types";
import ImageUpload from "../UI/ImageUpload";
import TWInput from "../UI/Input";
import TWTextArea from "../UI/Input/Textarea.input";
import SongUploadControl from "./SongUploadControl";
import SelectMultiple from "../UI/SelectMultiple";
import { TWButton } from "../UI/Button";
import { GENRES } from "@/services/types/artists.types";

interface EditViewSongSectionProps {
  song?: ISongsDto;
}

export default function EditViewSongSection(props: EditViewSongSectionProps) {
  const { song } = props;

  return (
    <div className="w-full gap-5 flex flex-col">
      <div className="flex flex-row gap-4 w-full">
        <ImageUpload
          name="coverImage"
          onChange={console.log}
          text="Cover Image"
          className="w-[40%]"
        />
        <div className="w-full flex flex-col gap-6">
          <SongUploadControl height={80} />
          <TWInput placeholder="Song title" label="" />
        </div>
      </div>
      <div className="">
        <div className="flex gap-4 flex-col">
          <TWTextArea placeholder="comment" rows={3} />
        </div>
      </div>
      <div className="">
        <SelectMultiple
          options={[]}
          selected={[]}
          onSelect={console.log}
          placeholder="Select Artists"
        />
      </div>
      <div className="">
        <SelectMultiple
          options={[]}
          selected={[]}
          onSelect={console.log}
          placeholder="Select Albums"
        />
      </div>
      <div className="">
        <SelectMultiple
          options={GENRES.map((genre) => ({ name: genre, value: genre }))}
          selected={[]}
          onSelect={console.log}
          placeholder="Select Genre"
        />
      </div>
      <div>
        <TWButton>Save song</TWButton>
      </div>
    </div>
  );
}
