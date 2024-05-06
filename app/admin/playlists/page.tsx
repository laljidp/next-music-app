"use client";

import HeadingLayout from "@/components/Layouts/HeadingLayout";
import AddPlaylistsModal from "@/components/Playlist/AddPlaylistModal";
import Playlists from "@/components/Playlist/Playlists";
import { useRef, useState } from "react";

const PlaylistsAdminPage = () => {
  const [showAddModal, setShowModal] = useState(false);
  const playlistRef = useRef<{ refreshPlaylists: () => void | null }>(null);
  return (
    <div>
      <div>
        <HeadingLayout
          title="Music Playlists"
          description="All the playlists of users choices & favorite songs"
          showAddButton
          handleAddClick={() => setShowModal(true)}
        />
      </div>
      <div className="mx-auto md:w-[100%]">
        <div className="py-4 shadow-sm">
          <Playlists ref={playlistRef} />
        </div>
      </div>
      <AddPlaylistsModal
        isOpen={showAddModal}
        onClose={() => setShowModal(false)}
        onPlaylistAdded={() => playlistRef?.current?.refreshPlaylists()}
      />
    </div>
  );
};

export default PlaylistsAdminPage;
