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
import ReadOnlyLayout from "../Layouts/readOnly.layout";
import ImagePreviewLayout from "../Layouts/imagePreview.layout";

interface EditViewArtistProps {
  artist: ArtistsDto | null;
  onArtistAdded?: () => void;
  onAddNewSelection: () => void;
}

const initPayload = {
  name: "",
  bio: "",
  genre: [] as string[],
  image: "",
};

export default function EditViewArtist(props: EditViewArtistProps) {
  const {
    artist,
    onArtistAdded = () => {},
    onAddNewSelection = () => {},
  } = props;
  const [artistPayload, setArtistPayload] = useState(initPayload);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [isProcessing, setProcessing] = useState(false);

  const { showSnack } = useContext(SnackContext);

  const handleAddArtist = () => {
    setArtistPayload(initPayload);
    setIsReadOnly(false);
    setIsNew(true);
    onAddNewSelection();
  };

  const handleSaveArtist = async () => {
    if (isNew) {
      setProcessing(true);
      const payload = {
        name: artistPayload.name,
        bio: artistPayload.bio,
        genre: artistPayload.genre,
        image: artistPayload.image || null,
      };
      const newArtist = (await saveArtists(payload)) as ArtistsDto;
      if (newArtist) {
        showSnack("Artist saved.", "info");
        setArtistPayload({
          bio: newArtist?.bio || "",
          name: newArtist?.name || "",
          genre: newArtist?.genre || [],
          image: newArtist?.image || "",
        });
        onArtistAdded();
        setProcessing(false);
        // TODO:: show notification and refetch artists
      }
    } else {
      // TODO: manage update artist data
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (artist) {
      setArtistPayload({
        bio: props?.artist?.bio || "",
        genre: (props?.artist?.genre || []) as string[],
        image: props?.artist?.image || "",
        name: props?.artist?.name || "",
      });
      setIsReadOnly(true);
      setIsNew(false);
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
        isReadOnly && "anim-scale-down"
      }`}
    >
      <div className="flex justify-between">
        {!isNew && (
          <TWButton
            onClick={handleAddArtist}
            className="w-8 h-8 flex"
            variant="outline"
          >
            <PlusOutlined className="font-bold text-md" />
          </TWButton>
        )}

        <TWSwitch
          name="isReadOnly"
          label="ReadOnly"
          isDisabled={isNew}
          checked={isReadOnly}
          onChange={setIsReadOnly}
        />
      </div>
      <hr className="p-0 m-0" />
      {isReadOnly ? (
        <ImagePreviewLayout
          src={artistPayload?.image || ""}
          alt="image-artist"
        />
      ) : (
        <ImageUpload
          name="artist-image"
          text="Upload Image"
          src={artistPayload.image}
          onChange={(file_url) => {
            handleChange({
              name: "image",
              value: file_url,
            });
          }}
        />
      )}

      {isReadOnly ? (
        <ReadOnlyLayout label="Artist Name" value={artistPayload.name} />
      ) : (
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
      )}

      {isReadOnly ? (
        <ReadOnlyLayout label="Bio" value={artistPayload.bio} />
      ) : (
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
      )}

      <SelectMultiple
        options={GENRES.map((genre) => ({ name: genre, value: genre }))}
        placeholder="Select Genre"
        selected={artistPayload?.genre}
        label="Genre"
        isReadOnly={isReadOnly}
        name="genre"
        onSelect={(values) =>
          handleChange({
            name: "genre",
            value: values,
          })
        }
      />
      {!isReadOnly && (
        <TWButton
          loading={isProcessing}
          onClick={handleSaveArtist}
          className="w-[115px]"
        >
          Save
        </TWButton>
      )}
    </div>
  );
}
