import React, { useContext, useEffect, useState } from "react";
import { TWButton } from "@/components/UI/Button";
import ImageUpload from "@/components/UI/ImageUpload";
import TWInput from "@/components/UI/Input";
import TWTextArea from "@/components/UI/Input/Textarea.input";
import SelectMultiple from "@/components/UI/SelectMultiple";
import { ArtistsDto, GENRES } from "@/services/types/artists.types";
import { PlusOutlined } from "@ant-design/icons";
import TWSwitch from "../UI/Switch";
import artistRequest from "@/services/request/artists.request";
import { SnackContext } from "@/context/snack.context";

interface EditViewArtistProps {
  artist: ArtistsDto | null;
  handleSelectArtist: (artist: ArtistsDto) => void;
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
    handleSelectArtist = () => {},
  } = props;
  const [artistPayload, setArtistPayload] = useState(initPayload);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const [animClass, setAnimClass] = useState<"animation-scale-up-tl" | "">(
    "animation-scale-up-tl"
  );

  const { showSnack } = useContext(SnackContext);

  const handleAddArtist = () => {
    setArtistPayload(initPayload);
    setIsReadOnly(false);
    setIsNew(true);
    onAddNewSelection();
  };

  const toggleAnimClass = () => {
    setAnimClass("");
    setTimeout(() => {
      setAnimClass("animation-scale-up-tl");
    }, 20);
  };

  useEffect(() => {
    if (artist) {
      setArtistPayload({
        bio: artist?.bio || "",
        genre: (artist?.genre || []) as string[],
        image: artist?.image || "",
        name: artist?.name || "",
      });
      setIsReadOnly(true);
      setIsNew(false);
      toggleAnimClass();
    }
  }, [artist]);

  const handleChange = ({ name, value }: { name: string; value: any }) => {
    setArtistPayload({
      ...artistPayload,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);
    if (isNew) {
      try {
        const payload = {
          name: artistPayload.name,
          bio: artistPayload.bio,
          genre: artistPayload.genre,
          image: artistPayload.image || null,
        };
        const newArtist = (await artistRequest.saveArtistsRequest(
          payload
        )) as ArtistsDto;
        if (newArtist) {
          // show notification and refetch artists
          showSnack("Artist saved.", "info");
          setArtistPayload({
            bio: newArtist?.bio || "",
            name: newArtist?.name || "",
            genre: newArtist?.genre || [],
            image: newArtist?.image || "",
          });
          onArtistAdded();
          setIsNew(false);
          setIsReadOnly(true);
          handleSelectArtist(newArtist);
        }
      } catch (err: any) {
        showSnack(err?.toString(), "warning");
      } finally {
        setProcessing(false);
      }
    } else {
      // manage update artist data
      try {
        const updatedArtist = await artistRequest.updateArtistRequest({
          _id: artist?._id || "",
          name: artistPayload.name,
          bio: artistPayload.bio,
          genre: artistPayload.genre,
          image: artistPayload.image,
        });
        if (updatedArtist.name) {
          showSnack(`Data saved.`, "success");
          setIsReadOnly(true);
          onArtistAdded();
        }
      } catch (err) {
        console.log("Error saving artist", err);
      } finally {
        setProcessing(true);
      }
    }
  };

  if (!artist && !isNew) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center text-center h-[65vh]">
        <TWButton
          onClick={handleAddArtist}
          className="w-8 h-8 flex"
          variant="outline"
        >
          <PlusOutlined className="font-bold text-md" />
        </TWButton>
        <p className="text-sm">
          Select an artist or click the '+' button to switch to{" "}
          <span className="font-medium">Add New Artist</span> layout.
        </p>
      </div>
    );
  }

  return (
    <form method="post" onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex w-[100%] flex-col 
        justify-center gap-3 ${animClass}`}
      >
        <div className="flex justify-between flex-row-reverse">
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
            label="Read Only"
            isDisabled={isNew}
            checked={isReadOnly}
            onChange={setIsReadOnly}
          />
        </div>
        <hr className="p-0 m-0" />
        <div className="text-slate-600 text-xs">
          Artists /{" "}
          <span className="text-violet-600">
            {artistPayload?.name || "Add New"}
          </span>
        </div>

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
          previewMode={isReadOnly}
        />
        <TWInput
          onChange={({ currentTarget }) => {
            handleChange({
              name: "name",
              value: currentTarget.value,
            });
          }}
          readOnly={isReadOnly}
          name="name"
          required={true}
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
          readOnly={isReadOnly}
          name="bio"
          required={true}
          placeholder="Bio"
          label={"Bio"}
          value={artistPayload?.bio}
        />

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
            // onClick={handleSaveArtist}
            className="w-[115px]"
            type="submit"
          >
            Save
          </TWButton>
        )}
      </div>
    </form>
  );
}
