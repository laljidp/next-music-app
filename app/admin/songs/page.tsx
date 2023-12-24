"use client";
import MainRightLayout from "@/components/Layouts/MainRightLayout";
import EditViewSongSection from "@/components/Songs/EditViewSong";
import SongsLists from "@/components/Songs/SongsLists";

export default function SongsPage() {
  return (
    <MainRightLayout>
      <MainRightLayout.Left>
        <SongsLists songs={[]} />
      </MainRightLayout.Left>
      <MainRightLayout.Separator />
      <MainRightLayout.Right>
        <EditViewSongSection />
      </MainRightLayout.Right>
    </MainRightLayout>
  );
}
