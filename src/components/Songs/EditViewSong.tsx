"use client";
import dynamic from "next/dynamic";
import useSWR from "swr";
import TWSwitch from "../UI/Switch";
import AddNewButton from "../UI/Button/AddNewButton";
import ImageUpload from "../UI/ImageUpload";
import TWInput from "../UI/Input";
import TWTextArea from "../UI/Input/Textarea.input";
import SongUploadControl from "./SongUploadControl";
import artistRequest from "@/services/request/artists.request";
import songsRequest from "@/services/request/songs.request";
import { ISongsDto, ISongsMetadata } from "@/services/types/songs.types";
import { TWButton } from "../UI/Button";
import { GENRES } from "@/services/types/artists.types";
import { useCallback, useContext, useEffect, useState } from "react";
import { apiUrls } from "@/constants";
import { SnackContext } from "@/context/snack.context";

const SelectMultiple = dynamic(() => import("../UI/SelectMultiple"), {
  ssr: false,
});

interface EditViewSongSectionProps {
  song?: ISongsDto | null;
  onSongAdded?: () => void;
  selectedAlbum?: string;
}

const initPayload: ISongsDto = {
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
  const [readOnly, setReadOnly] = useState(false);
  const [isNew, setNew] = useState(true);
  const { data: artists, isLoading: artistLoading } = useSWR(
    { search: "", minimal: true, path: apiUrls.artists },
    artistRequest.fetchArtists,
    {
      fallbackData: [],
      revalidateOnFocus: false,
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

  const handleSetNew = () => {
    setNew(true);
    setReadOnly(false);
    setSongPayload({ ...initPayload });
  };

  useEffect(() => {
    if (song) {
      const payload: ISongsDto = {
        artists: song.artists || [],
        duration: song.duration,
        genre: song.genre,
        source: song.source,
        title: song.title,
        coverImage: song.coverImage,
        metadata: song.metadata,
        lyrics: song.lyrics,
      };
      setReadOnly(true);
      setNew(false);
      setSongPayload(payload);
    }
  }, [song]);

  return (
    <form className="w-full" onSubmit={handleSubmitSong}>
      <div className="w-full gap-3 flex flex-col">
        <div className="flex justify-between items-center">
          <TWSwitch
            label="Readonly"
            isDisabled={isNew}
            checked={readOnly}
            onChange={setReadOnly}
            name="switch-song-readonly"
          />
          <AddNewButton onClick={handleSetNew} />
        </div>
        <hr />
        <div className="flex flex-row gap-4 w-full">
          <div className="w-[40%] flex flex-col gap-4">
            <ImageUpload
              name="coverImage"
              onChange={(src) => handleChange("coverImage", src)}
              src={songPayload?.coverImage}
              previewMode={readOnly}
              text="Cover Image"
              className="[height:150px] w-full"
            />
            <SongUploadControl
              className="h-20"
              labelText="Upload song"
              readOnly={readOnly}
              onDurationChange={(duration) =>
                handleChange("duration", duration)
              }
              source={songPayload.source}
              onFileUpload={handleSourceChange}
            />
          </div>
          <div className="w-[60%] flex flex-col gap-4">
            <TWInput
              placeholder="Song Title"
              name="title"
              label="Song Title *"
              readOnly={readOnly}
              value={songPayload?.title}
              onChange={({ currentTarget }) =>
                handleChange(currentTarget.name, currentTarget.value)
              }
            />
            <TWTextArea
              value={songPayload.lyrics}
              label="Lyrics"
              placeholder={readOnly && !songPayload.lyrics ? "N/A" : "Lyrics"}
              readOnly={readOnly}
              name="lyrics"
              onChange={({ currentTarget }) =>
                handleChange(currentTarget.name, currentTarget.value)
              }
              rows={6}
            />
          </div>
        </div>
        <div>
          <SelectMultiple
            options={GENRES.map((genre) => ({ name: genre, value: genre }))}
            selected={songPayload.genre}
            name="genre"
            label="Select Genre"
            isReadOnly={readOnly}
            onSelect={(selected) => handleChange("genre", selected)}
            placeholder="Select Genre"
          />
        </div>
        <div>
          <SelectMultiple
            label="Select Artists"
            options={
              artists?.map((ar) => ({ name: ar.name, value: ar._id })) || []
            }
            isReadOnly={readOnly}
            selected={songPayload.artists}
            onSelect={(selected) => handleChange("artists", selected)}
            loading={artistLoading}
            placeholder="Select Artists"
          />
        </div>
        <div className="aria-hide" aria-hidden={readOnly}>
          <TWButton loading={isProcessing} type="submit">
            Save song
          </TWButton>
        </div>
      </div>
    </form>
  );
}
