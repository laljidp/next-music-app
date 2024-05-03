"use client";
import HeadingLayout from "@/components/Layouts/HeadingLayout";
import MediaPlaceholder from "@/components/Media/MediaPlaceholder";
import MediaUploadModal from "@/components/Media/MediaUploadModal";
import { useState } from "react";

export default function MediaPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div>
      <HeadingLayout
        title="Photo Media"
        description="All media photos for songs cover, albums & artists."
        showAddButton
        handleAddClick={() => setShowUploadModal(true)}
      />
      <div className="mt-4">
        <MediaPlaceholder />
      </div>
      <MediaUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  );
}
