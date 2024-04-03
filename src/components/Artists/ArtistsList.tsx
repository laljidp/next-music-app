import { ArtistsDto } from "@/services/types/artists.types";
import { SolutionOutlined } from "@ant-design/icons";
import Image from "next/image";

interface IArtistsListProps {
  artists: ArtistsDto[];
  artistSelectedID?: string | null;
  onSelectArtist?: (artist: ArtistsDto) => void;
  className?: string;
  loadMore?: React.ReactNode;
}

export default function ArtistsList(props: IArtistsListProps) {
  const { artists, className, onSelectArtist = () => {}, loadMore } = props;
  return (
    <div className={`mt-3 h-full ${className}`}>
      <div
        aria-hidden={!!artists.length}
        className="flex justify-center items-center h-[85%] aria-hide"
      >
        <span className="font-medium px-3 py-2 rounded-lg flex flex-col items-center text-violet-600">
          <SolutionOutlined className="[&>svg]:h-8 w-8 text-5xl [&>svg]:fill-violet-500" />
          No Artists found
        </span>
      </div>
      {artists.map((artist) => (
        <>
          <div
            key={artist._id}
            role="button"
            aria-selected={artist._id === props.artistSelectedID}
            onClick={() => onSelectArtist(artist)}
            className="card-layout"
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
        </>
      ))}
      {loadMore && <div className="p-2 text-center">{loadMore}</div>}
    </div>
  );
}
