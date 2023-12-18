import React, { useEffect, useState } from "react";
import { TWButton } from "@/components/UI/Button";
import ImageUpload from "@/components/UI/ImageUpload";
import TWInput from "@/components/UI/Input";
import TWTextArea from "@/components/UI/Input/textrea.input";
import SelectMultiple from "@/components/UI/SelectMultiple";
import { ArtistsDto, GENRES } from "@/services/types/artists.types";
import { PlusOutlined } from "@ant-design/icons";
import TWSwitch from "../UI/Switch";

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

  const handleAddArtist = () => {
    setArtistPayload(initPayload);
    setIsReadOnly(false);
    setIsNew(true);
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
      }, 750);
      setIsReadOnly(true);
    }
  }, [props.artist]);

  const handleChange = (payload: { name: string; value: any }) => {
    setArtistPayload({
      ...artistPayload,
      [payload.name]: payload.value,
    });
  };

  if (artistPayload)
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
          onChange={(file) => {
            console.log(file);
          }}
        />
        <TWInput
          onChange={({ currentTarget }) =>
            handleChange({
              name: currentTarget.name,
              value: currentTarget.value,
            })
          }
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
        <TWButton className="w-[145px]">Save</TWButton>
      </div>
    );
}
