"use client";
import { GENRES } from "@/services/types/artists.types";
import { TWButton } from "../UI/Button";
import TWDatePicker from "../UI/DatePicker";
import ImageUpload from "../UI/ImageUpload";
import TWInput from "../UI/Input";
import TWTextArea from "../UI/Input/Textarea.input";
import SelectMultiple from "../UI/SelectMultiple";
import GradientColorPicker from "../GradientColorPicker";
import { useEffect, useState } from "react";
import { IAlbumDto, IAlbumStatPayload } from "@/services/types/albums.types";

interface EditViewAlbumLayout {
  album?: IAlbumDto;
  onSelectAlbum?: (album: IAlbumDto) => void;
}

export default function EditViewAlbumLayout({ album }: EditViewAlbumLayout) {
  const [albumPayload, setAlbumPayload] = useState<IAlbumStatPayload>({
    description: album?.description || "",
    genre: album?.genre || [],
    gradientColors: album?.setting.gradientColors || [],
    releaseDate: album?.releaseDate || "",
    title: album?.title || "",
    coverImage: album?.coverImage || "",
  });

  const handleChange = (name: string, value: string | string[]) => {
    setAlbumPayload({
      ...albumPayload,
      [name]: value,
    });
  };

  useEffect(() => {
    if (album) {
      setAlbumPayload({
        description: album?.description || "",
        genre: album?.genre || [],
        gradientColors: album?.setting.gradientColors || [],
        releaseDate: album?.releaseDate || "",
        title: album?.title || "",
        coverImage: album.coverImage,
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="w-[100%] flex-grow justify-between flex gap-[2rem]">
        <div className="flex flex-col gap-3 w-[100%]">
          <ImageUpload
            name="coverImage"
            onChange={(url) => handleChange("coverImage", url)}
            className="h-[130px] w-[230px]"
            src={albumPayload.coverImage || ""}
          />
          <TWInput
            name="title"
            placeholder="Title"
            value={albumPayload.title}
            label="Title"
            onChange={({ currentTarget }) =>
              handleChange(currentTarget?.name, currentTarget?.value || "")
            }
          />
          <TWTextArea
            name="description"
            value={albumPayload.description}
            placeholder="Description"
            label="Description"
            rows={5}
            onChange={({ currentTarget }) =>
              handleChange(currentTarget?.name, currentTarget?.value || "")
            }
          />
        </div>
        <div className="flex flex-col w-[100%] gap-3">
          <TWDatePicker
            label="Release Date"
            name="releaseDate"
            date={albumPayload?.releaseDate}
            onSelectDate={(date) =>
              handleChange("releaseDate", date?.toDateString() || "")
            }
          />
          <hr className="border-2 border-violet-400 font-bold" />
          <span className="font-medium">Settings</span>
          <GradientColorPicker
            name="gradientColors"
            colors={albumPayload.gradientColors}
            label="Gradient cover colors"
            onColorChanges={(colors) => handleChange("gradientColors", colors)}
          />
        </div>
      </div>
      <div>
        <SelectMultiple
          onSelect={(selected) => {
            handleChange("genre", selected);
          }}
          options={GENRES.map((g) => ({ name: g, value: g }))}
          selected={albumPayload.genre}
          name="genre"
          placeholder="Select Genre"
        />
      </div>
      <div className="flex">
        <TWButton>Save Album</TWButton>
      </div>
    </div>
  );
}
