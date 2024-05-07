import React, { useContext, useEffect, useState } from "react";
import ImageUpload from "@/components/UI/ImageUpload";
import TWInput from "@/components/UI/Input";
import TWTextArea from "@/components/UI/Input/Textarea.input";
import SelectMultiple from "@/components/UI/SelectMultiple";
import TWSwitch from "../UI/Switch";
import artistRequest from "@/services/request/artists.request";
import AddNewButton from "../UI/Button/AddNewButton";
import { ArtistsDto, GENRES } from "@/services/types/artists.types";
import { SnackContext } from "@/context/snack.context";
import { TWButton } from "@/components/UI/Button";

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
    "animation-scale-up-tl",
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
          payload,
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
        const updatedArtist = await artistRequest.updateArtistRequest(
          artist?._id || "-",
          {
            name: artistPayload.name,
            bio: artistPayload.bio,
            genre: artistPayload.genre,
            image: artistPayload.image,
          },
        );
        if (updatedArtist.name) {
          showSnack(`Artists record updated.`, "success");
          setIsReadOnly(true);
          onArtistAdded();
        }
      } catch (err) {
        console.log("Error saving artist", err);
        showSnack(err?.toString() || "Artist not updated", "warning");
      } finally {
        setProcessing(false);
      }
    }
  };

  if (!artist && !isNew) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <AddNewButton onClick={handleAddArtist} />
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
        <div className="flex flex-row-reverse justify-between">
          <AddNewButton onClick={handleAddArtist} />
          {!isNew && (
            <TWSwitch
              name="isReadOnly"
              label="Read Only"
              checked={isReadOnly}
              onChange={setIsReadOnly}
            />
          )}
        </div>
        <hr className="m-0 p-0" />
        <div className="text-xs text-slate-600">
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
          label={"Artist Name *"}
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
          label={"Bio *"}
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
        <TWButton
          aria-hidden={isReadOnly}
          loading={isProcessing}
          className="aria-hide w-[115px]"
          type="submit"
        >
          Save
        </TWButton>
      </div>
    </form>
  );
}
