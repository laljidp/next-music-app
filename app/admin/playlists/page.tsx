import HeadingLayout from "@/components/Layouts/HeadingLayout";
import Playlists from "@/components/Playlist/Playlists";

const PlaylistsAdminPage = () => {
  return (
    <div>
      <div>
        <HeadingLayout
          title="Music Playlists"
          description="All the playlists of users choices & favorite songs"
        />
      </div>
      <div className="mx-auto md:w-[100%]">
        <div className="py-4 shadow-sm">
          <Playlists />
        </div>
      </div>
    </div>
  );
};

export default PlaylistsAdminPage;
