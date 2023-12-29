"use client";
import { GENRES } from "@/services/types/artists.types";
import { TWButton } from "../UI/Button";
import TWDatePicker from "../UI/DatePicker";
import ImageUpload from "../UI/ImageUpload";
import TWInput from "../UI/Input";
import TWTextArea from "../UI/Input/Textarea.input";
import SelectMultiple from "../UI/SelectMultiple";
import GradientColorPicker from "../GradientColorPicker";
import { useContext, useEffect, useMemo, useState } from "react";
import { IAlbumDto, IAlbumStatPayload } from "@/services/types/albums.types";
import useSWR from "swr";
import artistRequest from "@/services/request/artists.request";
import { albumRequest } from "@/services/request/albums.request";
import { SnackContext } from "@/context/snack.context";
import TWSwitch from "../UI/Switch";
import {
  InfoCircleFilled,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import AddNewButton from "../UI/Button/AddNewButton";

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
  const [matcherPayload, setMatcherPayload] =
    useState<IAlbumStatPayload>(initPayload);
  const [isReadOnly, setReadOnly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [showSongsLayout, setShowSongsLayout] = useState(false);
  const { showSnack } = useContext(SnackContext);

  const [animClass, setAnimClass] = useState<"animation-scale-up-tl" | "">(
    "animation-scale-up-tl"
  );

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

  const toggleAnimClass = () => {
    setAnimClass("");
    setTimeout(() => {
      setAnimClass("animation-scale-up-tl");
    }, 20);
  };

  const handleAddAlbum = () => {
    setAlbumPayload(initPayload);
    setMatcherPayload(initPayload);
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
      console.log({ _album });
      if (_album) {
        const newPayload = {
          description: _album?.description || "",
          genre: _album?.genre || [],
          gradientColors: _album?.setting.gradientColors || [],
          releaseDate: _album?.releaseDate || "",
          title: _album?.title || "",
          coverImage: _album.coverImage || "",
          artists: _album?.artists || [],
        };
        onSelectAlbum(_album);
        setReadOnly(true);
        setIsNew(false);
        showSnack("Album data saved!", "success");
        setAlbumPayload(newPayload);
        setMatcherPayload(newPayload);
        onAlbumSaved();
      }
    } catch (err: any) {
      console.log("Error while posting request to save album::", err);
      showSnack(err?.toString(), "warning");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (album) {
      const newPayload = {
        description: album?.description || "",
        genre: album?.genre || [],
        gradientColors: album?.setting.gradientColors || [],
        releaseDate: album?.releaseDate || "",
        title: album?.title || "",
        coverImage: album.coverImage || "",
        artists: album?.artists || [],
      };
      setAlbumPayload(newPayload);
      setMatcherPayload(newPayload);
      setIsNew(false);
      setShowSongsLayout(false);
      setReadOnly(true);
      toggleAnimClass();
    }
  }, [album]);

  const isChangesSaved = useMemo(() => {
    if (JSON.stringify(albumPayload) === JSON.stringify(matcherPayload)) {
      return true;
    } else {
      return false;
    }
  }, [albumPayload, matcherPayload]);

  console.log("Rendering EditViewAlbumLayout");

  if (!album && !isNew) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-[65vh]">
        <AddNewButton onClick={handleAddAlbum} />
        <p className="text-sm">
          Select an album or click the '+' button to switch to{" "}
          <span className="font-medium">Add New Album</span> layout.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        id="album-songs-layout"
        aria-hidden={!showSongsLayout}
        className="anim-scale-out-top"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <LeftOutlined className="[&>svg]:fill-violet-500" />
            <span
              role="button"
              onClick={() => setShowSongsLayout(false)}
              className="select-none text-violet-500 font-medium cursor-pointer hover:scale-110"
            >
              Back
            </span>
          </div>
          <hr />
          <div>Songs lists</div>
        </div>
      </div>
      <div
        id="album-form-layout"
        aria-hidden={showSongsLayout}
        className={`anim-scale-out-right`}
      >
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-5 w-full">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <span
                  role="button"
                  onClick={() => setShowSongsLayout(true)}
                  className="select-none text-violet-500 font-medium cursor-pointer hover:scale-110"
                >
                  Songs
                </span>
                <RightOutlined className="[&>svg]:fill-violet-500" />
              </div>
              <div className="flex items-center gap-4">
                <div
                  aria-hidden={isChangesSaved}
                  className="flex items-center gap-2 aria-hide"
                >
                  <InfoCircleFilled className="[&>svg]:fill-yellow-500 [&>svg]:font-bold" />
                  <span className="text-xs">Unsaved changes.</span>
                </div>
                <TWSwitch
                  name="isReadOnly"
                  label="ReadOnly"
                  isDisabled={isNew}
                  checked={isReadOnly}
                  onChange={setReadOnly}
                />
                <AddNewButton onClick={handleAddAlbum} />
              </div>
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
                  label="Title *"
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
                  label="Description *"
                  rows={4}
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
                <hr className="border-1 border-violet-400 font-bold" />
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
                disabled={isChangesSaved}
                type="submit"
                className="aria-hide"
              >
                Save Album
              </TWButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
