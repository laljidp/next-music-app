import { ArtistsDto } from "@/services/types/artists.types";
import Image from "next/image";

interface IArtistsListProps {
  artists: ArtistsDto[];
  artistSelectedID?: string | null;
  onSelectArtist?: (artist: ArtistsDto) => void;
  className?: string;
}

export default function ArtistsList(props: IArtistsListProps) {
  const { artists, className, onSelectArtist = () => {} } = props;
  return (
    <div className={`mt-3 h-full ${className}`}>
      {artists.map((artist) => (
        <div
          key={artist._id}
          role="button"
          aria-selected={artist._id === props.artistSelectedID}
          onClick={() => onSelectArtist(artist)}
          className="p-2 border-b-1 border-slate-400 border-1 border-solid
            flex items-center hover:bg-slate-100 rounded-lg cursor-pointer aria-[selected=true]:bg-violet-200"
        >
          <Image
            alt="artist-pic"
            src={artist.image || "/no-profile-image.png"}
            height={40}
            width={40}
            className="rounded-lg mr-3 h-12 w-12 object-cover"
          />
          <div className="flex flex-col">
            <span>{artist.name}</span>
            <span className="text-xs">{artist.bio}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
