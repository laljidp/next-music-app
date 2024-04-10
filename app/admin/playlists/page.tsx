import Playlists from "@/components/Playlist/Playlists";
import TWInput from "@/components/UI/Input";
import { SearchOutlined } from "@ant-design/icons";

const PlaylistsAdminPage = () => {
  return (
    <div className="mx-auto px-5 md:w-[100%] lg:w-[90%] xl:w-[70%]">
      {/* TODO: Playlists components */}
      <div className="py-4 shadow-sm">
        <Playlists />
      </div>
    </div>
  );
};

export default PlaylistsAdminPage;
