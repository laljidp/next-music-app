import { IAlbumDto } from "@/services/types/albums.types";
import { SolutionOutlined } from "@ant-design/icons";
import Image from "next/image";

interface AlbumListsProps {
  albums?: IAlbumDto[];
  className?: string;
  albumSelectedID?: string;
  onSelectAlbum: (album: IAlbumDto) => void;
}

export default function AlbumLists(props: AlbumListsProps) {
  const {
    albums = [],
    className = "",
    albumSelectedID,
    onSelectAlbum = () => {},
  } = props;
  return (
    <div className={`mt-3 h-full ${className}`}>
      {!albums?.length && (
        <div className="flex justify-center items-center h-[85%]">
          <span className="font-medium px-3 py-2 rounded-lg flex flex-col items-center text-violet-600">
            <SolutionOutlined
              className="[&>svg]:h-8 w-8 text-5xl [&>svg]:fill-violet-500"
              // style={{ fontSize: 35 }}
            />
            No Albums found
          </span>
        </div>
      )}
      {albums?.map((album) => (
        <div
          key={album._id}
          role="button"
          aria-selected={album?._id === props.albumSelectedID}
          onClick={() => onSelectAlbum(album)}
          className="p-2 border-b-1 border-slate-400 border-1 border-solid
            flex items-center hover:bg-slate-100 rounded-lg cursor-pointer
            aria-[selected=true]:bg-violet-200"
        >
          <Image
            alt="artist-pic"
            src={album?.coverImage || "/no-profile-image.png"}
            height={40}
            width={40}
            priority
            className="rounded-lg mr-3 h-12 w-12 object-cover"
          />
          <div className="flex flex-col">
            <span>{album.title}</span>
            <span className="text-xs">{album.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
