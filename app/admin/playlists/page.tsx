import TWInput from "@/components/UI/Input";
import { SearchOutlined } from "@ant-design/icons";

const PlaylistsAdminPage = () => {
  return (
    <div className="px-5 md:w-[100%] lg:w-[90%] xl:w-[70%] mx-auto">
      <TWInput
        placeholder="Search playlists"
        icon={<SearchOutlined className="text-gray-400" />}
      />
      {/* TODO: Playlists components */}
      <div className="p-2">No playlist found.</div>
    </div>
  );
};

export default PlaylistsAdminPage;
