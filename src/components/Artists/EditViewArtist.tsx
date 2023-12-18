import React, { useContext, useEffect, useState } from "react";
import { TWButton } from "@/components/UI/Button";
import ImageUpload from "@/components/UI/ImageUpload";
import TWInput from "@/components/UI/Input";
import TWTextArea from "@/components/UI/Input/textrea.input";
import SelectMultiple from "@/components/UI/SelectMultiple";
import { ArtistsDto, GENRES } from "@/services/types/artists.types";
import { PlusOutlined } from "@ant-design/icons";
import TWSwitch from "../UI/Switch";
import { saveArtists } from "@/services/fetcher/artists.fetcher";
import { SnackContext } from "@/context/snack.context";

interface EditViewArtistProps {
  artist: ArtistsDto | null;
}

const initPayload = {
  name: "",
  bio: "",
  genre: [] as string[],
  image: "",
};

export default function EditViewArtist(props: EditViewArtistProps) {
  const [artistPayload, setArtistPayload] = useState(initPayload);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isNew, setIsNew] = useState(false);

  const { showSnack } = useContext(SnackContext);

  const handleAddArtist = () => {
    setArtistPayload(initPayload);
    setIsReadOnly(false);
    setIsNew(true);
  };

  console.log({ artistPayload });

  const handleSaveArtist = async () => {
    if (isNew) {
      const payload = {
        name: artistPayload.name,
        bio: artistPayload.bio,
        genre: artistPayload.genre,
        image: artistPayload.image || null,
      };
      const artist = await saveArtists(payload);
      if (artist) {
        showSnack("Artist saved.", "info");
        // TODO:: show notification and refetch artists
      }
    } else {
      // TODO: manage update artist data
    }
  };

  useEffect(() => {
    if (props.artist) {
      setArtistPayload({
        bio: props?.artist?.bio || "",
        genre: (props?.artist?.genre || []) as string[],
        image: props?.artist?.image || "",
        name: props?.artist?.name || "",
      });

      setIsNew(true);
      setTimeout(() => {
        setIsNew(false);
      }, 350);
      setIsReadOnly(true);
    }
  }, [props.artist]);

  const handleChange = ({ name, value }: { name: string; value: any }) => {
    setArtistPayload({
      ...artistPayload,
      [name]: value,
    });
  };

  return (
    <div
      className={`flex w-[100%] flex-col justify-center gap-5 ${
        isNew && "anim-scale-down"
      }`}
    >
      <div className="flex justify-between">
        <TWButton
          onClick={handleAddArtist}
          className="w-8 h-8 flex"
          variant="outline"
        >
          <PlusOutlined className="font-bold text-md" />
        </TWButton>
        <TWSwitch
          name="isReadOnly"
          label="ReadOnly"
          isDisabled={isNew}
          checked={isReadOnly}
          onChange={setIsReadOnly}
        />
      </div>
      <ImageUpload
        name="artist-image"
        text="Upload Image"
        onChange={(file_url) => {
          handleChange({
            name: "image",
            value: file_url,
          });
        }}
      />
      <TWInput
        onChange={({ currentTarget }) => {
          console.log(currentTarget.value);
          handleChange({
            name: "name",
            value: currentTarget.value,
          });
        }}
        name="name"
        placeholder="Artist name"
        label={"Artist Name"}
        value={artistPayload?.name}
      />
      <TWTextArea
        onChange={({ currentTarget }) =>
          handleChange({
            name: currentTarget.name,
            value: currentTarget.value,
          })
        }
        name="bio"
        placeholder="Bio"
        label={"Bio"}
        value={artistPayload?.bio}
      />
      <SelectMultiple
        options={GENRES.map((genre) => ({ name: genre, value: genre }))}
        placeholder="Select Genre"
        selected={artistPayload?.genre}
        label="Genre"
        name="genre"
        onSelect={(values) =>
          handleChange({
            name: "genre",
            value: values,
          })
        }
      />
      <TWButton onClick={handleSaveArtist} className="w-[145px]">
        Save
      </TWButton>
    </div>
  );
}
