import { ArtistsDto } from "@/services/types/artists.types";
import Image from "next/image";

interface IArtistsListProps {
  artists: ArtistsDto[];
}

export default function ArtistsList(props: IArtistsListProps) {
  const { artists } = props;
  return (
    <>
      <div className="mt-3">
        {artists.map((artist) => (
          <div
            key={artist._id}
            className="mb-2 p-2 border-b-1 border-slate-400 border-1 border-solid flex items-center"
          >
            <Image
              alt="artist-pic"
              src={artist.image || "/favicon-32x32.png"}
              height={40}
              width={40}
              className="rounded-lg mr-3"
            />
            <div className="flex flex-col">
              <span>{artist.name}</span>
              <span className="text-xs">{artist.bio}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
