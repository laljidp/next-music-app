"use client";
import { GENRES } from "@/services/types/artists.types";
import { TWButton } from "../UI/Button";
import TWDatePicker from "../UI/DatePicker";
import ImageUpload from "../UI/ImageUpload";
import TWInput from "../UI/Input";
import TWTextArea from "../UI/Input/Textarea.input";
import SelectMultiple from "../UI/SelectMultiple";
import GradientColorPicker from "../GradientColorPicker";
import { useContext, useEffect, useState } from "react";
import { IAlbumDto, IAlbumStatPayload } from "@/services/types/albums.types";
import useSWR from "swr";
import artistRequest from "@/services/request/artists.request";
import { albumRequest } from "@/services/request/albums.request";
import { SnackContext } from "@/context/snack.context";
import TWSwitch from "../UI/Switch";
import { PlusOutlined } from "@ant-design/icons";

interface EditViewAlbumLayout {
  album?: IAlbumDto | null;
  onSelectAlbum?: (album: IAlbumDto) => void;
  onAddNewSelection?: () => void;
  onAlbumSaved: () => void;
}

const initPayload = {
  description: "",
  genre: [],
  gradientColors: [],
  releaseDate: "",
  title: "",
  coverImage: "",
  artists: [],
};

export default function EditViewAlbumLayout({
  album,
  onAddNewSelection = () => {},
  onSelectAlbum = () => {},
  onAlbumSaved = () => {},
}: EditViewAlbumLayout) {
  const [albumPayload, setAlbumPayload] =
    useState<IAlbumStatPayload>(initPayload);
  const [isReadOnly, setReadOnly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const { showSnack } = useContext(SnackContext);

  const { isLoading: artistLoading, data: artists } = useSWR(
    {
      path: "/api/artists",
      search: "",
      minimal: true,
    },
    artistRequest.fetchArtists,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    }
  );

  const handleAddAlbum = () => {
    setAlbumPayload(initPayload);
    setReadOnly(false);
    setIsNew(true);
    onAddNewSelection();
  };

  const handleChange = (name: string, value: string | string[]) => {
    setAlbumPayload({
      ...albumPayload,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ albumPayload });
    try {
      setIsProcessing(true);

      let _album;

      if (isNew) {
        _album = await albumRequest.saveAlbum(albumPayload);
      } else {
        _album = await albumRequest.updateAlbum({
          _id: album?._id,
          ...albumPayload,
        });
      }

      if (_album) {
        setAlbumPayload(initPayload);
        console.log("resp", _album);
        showSnack("Album data saved!", "success");
        onAlbumSaved();
      }
    } catch (err) {
      console.log("Error while posting request to save album::", err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (album) {
      setAlbumPayload({
        description: album?.description || "",
        genre: album?.genre || [],
        gradientColors: album?.setting.gradientColors || [],
        releaseDate: album?.releaseDate || "",
        title: album?.title || "",
        coverImage: album.coverImage || "",
        artists: album?.artists || [],
      });
      setIsNew(false);
      setReadOnly(true);
    }
  }, [album]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-5 w-full">
        <div className="flex justify-between">
          {!isNew && (
            <TWButton
              onClick={handleAddAlbum}
              className="w-8 h-8 flex"
              variant="outline"
            >
              <PlusOutlined className="font-bold text-md" />
            </TWButton>
          )}

          <TWSwitch
            name="isReadOnly"
            label="Read Only"
            isDisabled={isNew}
            checked={isReadOnly}
            onChange={setReadOnly}
          />
        </div>
        <hr />
        <div className="w-[100%] flex-grow justify-between flex gap-[2rem]">
          <div className="flex flex-col gap-3 w-[100%]">
            <ImageUpload
              previewMode={isReadOnly}
              name="coverImage"
              onChange={(url) => handleChange("coverImage", url)}
              className="h-[130px] w-[230px]"
              src={albumPayload.coverImage || ""}
            />
            <TWInput
              readOnly={isReadOnly}
              name="title"
              required
              placeholder="Title"
              value={albumPayload.title}
              label="Title"
              onChange={({ currentTarget }) =>
                handleChange(currentTarget?.name, currentTarget?.value)
              }
            />
            <TWTextArea
              readOnly={isReadOnly}
              name="description"
              value={albumPayload.description}
              placeholder="Description"
              required
              label="Description"
              rows={5}
              onChange={({ currentTarget }) =>
                handleChange(currentTarget?.name, currentTarget?.value)
              }
            />
          </div>
          <div className="flex flex-col w-[100%] gap-3">
            <TWDatePicker
              isReadOnly={isReadOnly}
              label="Release Date"
              name="releaseDate"
              date={
                !!albumPayload?.releaseDate
                  ? new Date(albumPayload.releaseDate)
                  : undefined
              }
              onSelectDate={(date) =>
                handleChange("releaseDate", date?.toDateString() || "")
              }
            />
            <hr className="border-2 border-violet-400 font-bold" />
            <span className="font-medium">Settings</span>
            <GradientColorPicker
              name="gradientColors"
              isReadOnly={isReadOnly}
              colors={albumPayload.gradientColors}
              label="Gradient cover colors"
              onColorChanges={(colors) =>
                handleChange("gradientColors", colors)
              }
            />
          </div>
        </div>
        <div>
          <SelectMultiple
            isReadOnly={isReadOnly}
            onSelect={(selected) => {
              handleChange("artists", selected);
            }}
            options={artists.map((arts) => ({
              name: arts.name,
              value: arts._id,
            }))}
            selected={albumPayload.artists}
            name="artists"
            label="Artists"
            placeholder="Select Artists"
            loading={artistLoading}
          />
        </div>
        <div>
          <SelectMultiple
            isReadOnly={isReadOnly}
            onSelect={(genres) => {
              handleChange("genre", genres);
            }}
            options={GENRES.map((g) => ({ name: g, value: g }))}
            label="Genre"
            selected={albumPayload.genre}
            name="genre"
            placeholder="Select Genre"
          />
        </div>

        <div className="flex">
          <TWButton
            aria-hidden={isReadOnly}
            loading={isProcessing}
            type="submit"
            className="aria-[hidden=true]:hidden"
          >
            Save Album
          </TWButton>
        </div>
      </div>
    </form>
  );
}
