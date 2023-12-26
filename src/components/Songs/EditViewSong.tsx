import { ISongsDto, ISongsMetadata } from "@/services/types/songs.types";
import ImageUpload from "../UI/ImageUpload";
import TWInput from "../UI/Input";
import TWTextArea from "../UI/Input/Textarea.input";
import SongUploadControl from "./SongUploadControl";
import SelectMultiple from "../UI/SelectMultiple";
import { TWButton } from "../UI/Button";
import { GENRES } from "@/services/types/artists.types";
import useSWR from "swr";
import artistRequest from "@/services/request/artists.request";
import { useCallback, useContext, useEffect, useState } from "react";
import { apiUrls } from "@/constants";
import { albumRequest } from "@/services/request/albums.request";
import songsRequest from "@/services/request/songs.request";
import { SnackContext } from "@/context/snack.context";

interface EditViewSongSectionProps {
  song?: ISongsDto;
  onSongAdded?: () => void;
  selectedAlbum?: string;
}

const initPayload: ISongsDto = {
  albums: [],
  artists: [],
  duration: 0,
  genre: [],
  source: "",
  title: "",
  coverImage: "",
  lyrics: "",
};

export default function EditViewSongSection(props: EditViewSongSectionProps) {
  const { song, onSongAdded = () => {} } = props;
  const [songPayload, setSongPayload] = useState<ISongsDto>(initPayload);
  const [isProcessing, setProcessing] = useState(false);
  const { showSnack } = useContext(SnackContext);
  const [isNew, setNew] = useState(true);
  const {
    data: artists,
    isLoading: artistLoading,
    error,
  } = useSWR(
    { search: "", minimal: true, path: apiUrls.artists },
    artistRequest.fetchArtists,
    {
      fallbackData: [],
      revalidateOnFocus: false,
    }
  );

  const { data: albumsOption, isLoading: albumLoading } = useSWR(
    { search: "", path: apiUrls.albums, minimal: true },
    albumRequest.fetchAlbums,
    {
      revalidateOnFocus: false,
      fallbackData: [],
    }
  );

  const handleChange = useCallback(
    (name: string, value: string | string[] | number) => {
      if (songPayload) {
        setSongPayload({
          ...songPayload,
          [name]: value,
        });
      }
    },
    [songPayload]
  );

  const handleSubmitSong = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ songPayload });
    let error = [];
    if (!songPayload?.source || !songPayload.title) {
      const msg = "Please upload a song. its required";
      showSnack(msg, "error");
      error.push(msg);
    }
    if (!songPayload.title) {
      const msg = "Please enter song title";
      showSnack(msg, "error");
      error.push(msg);
    }
    if (!!error.length) return;

    setProcessing(true);
    try {
      let _song;
      if (isNew) {
        _song = await songsRequest.saveNewSong(songPayload);
      } else {
        _song = await songsRequest.updateSong(song?._id || "", songPayload);
      }
      if (_song) {
        showSnack("Song saved.", "success");
        onSongAdded();
        setSongPayload({ ...initPayload });
        // TODO: readonly and do other stuff
      } else {
        showSnack("Service looks down ! please try later.", "error");
      }
    } catch (err) {
      console.log("Error requesting for add/edit song", err);
      showSnack("Request for saving song failed ! Please try later", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleSourceChange = (source: string, metadata: ISongsMetadata) => {
    const sourceMetadata = {
      source,
      metadata: { ...metadata },
    };

    setSongPayload({
      ...songPayload,
      ...sourceMetadata,
    });
  };

  useEffect(() => {
    if (song) {
      setSongPayload({ ...song });
    }
  }, [song]);

  console.log("Song payload", songPayload);

  return (
    <form className="w-full" onSubmit={handleSubmitSong}>
      <div className="w-full gap-5 flex flex-col">
        <div className="flex flex-row gap-4 w-full">
          <ImageUpload
            name="coverImage"
            onChange={(src) => handleChange("coverImage", src)}
            src={songPayload?.coverImage}
            text="Cover Image"
            className="w-[40%]"
          />
          <div className="w-full flex flex-col gap-7">
            <SongUploadControl
              className="h-20"
              labelText="Upload song *"
              onDurationChange={(duration) =>
                handleChange("duration", duration)
              }
              source={songPayload.source}
              onFileUpload={handleSourceChange}
            />
            <TWInput
              placeholder="Song title"
              name="title"
              value={songPayload?.title}
              onChange={({ currentTarget }) =>
                handleChange(currentTarget.name, currentTarget.value)
              }
            />
          </div>
        </div>
        <div>
          <SelectMultiple
            options={
              artists?.map((ar) => ({ name: ar.name, value: ar._id })) || []
            }
            selected={songPayload.artists}
            onSelect={(selected) => handleChange("artists", selected)}
            loading={artistLoading}
            placeholder="Select Artists"
          />
        </div>
        <div className="">
          <SelectMultiple
            options={albumsOption.map((album) => ({
              name: album.title,
              value: album._id || "",
            }))}
            loading={albumLoading}
            selected={songPayload.albums}
            onSelect={(selected) => handleChange("albums", selected)}
            placeholder="Select Albums"
          />
        </div>
        <div className="">
          <SelectMultiple
            options={GENRES.map((genre) => ({ name: genre, value: genre }))}
            selected={songPayload.genre}
            name="genre"
            onSelect={(selected) => handleChange("genre", selected)}
            placeholder="Select Genre"
          />
        </div>
        <div>
          <div className="flex gap-4 flex-col">
            <TWTextArea
              value={songPayload.lyrics}
              placeholder="Lyrics"
              name="lyrics"
              onChange={({ currentTarget }) =>
                handleChange(currentTarget.name, currentTarget.value)
              }
              rows={3}
            />
          </div>
        </div>
        <div>
          <TWButton loading={isProcessing} type="submit">
            Save song
          </TWButton>
        </div>
      </div>
    </form>
  );
}
