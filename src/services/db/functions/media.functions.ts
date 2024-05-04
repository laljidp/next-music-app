import { MediaDto, MediaPayloadT } from "@/services/types/media.types";
import Media from "../schemas/media.schema";
import { ERROR_MSG, TFuncResponse } from "../db.utils";

export type getMediaPayloadT = {
  page: number;
  batch: number;
  searchTerm: string;
};

class MediaFunctions {
  addMedia = async (payload: MediaPayloadT): TFuncResponse<MediaDto> => {
    try {
      const data = (await Media.create(payload)) as MediaDto;
      if (!data) {
        return { error: "Error adding media" };
      }
      return { data };
    } catch (err) {
      console.log("Error addMedia function::", err);
      return { error: "Media not saved" };
    }
  };

  getMedia = async (
    payload: getMediaPayloadT,
    fields?: string[],
  ): TFuncResponse<MediaDto[]> => {
    try {
      const { batch, page, searchTerm } = payload;
      let finder = {};
      if (searchTerm?.trim()?.length) {
        const regex = new RegExp(searchTerm, "i");
        const conditions = [{ name: regex }, { description: regex }];
        finder = { $or: conditions };
      }
      const skip = Number(batch) * Number(page);
      const media = (await Media.find(finder)
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(batch)) as MediaDto[];

      return { data: media };
    } catch (err) {
      console.log("ERROR getMedia function:", err);
      return { error: "Failed to fetch media" };
    }
  };

  deleteMedia = async (
    _id: string,
  ): TFuncResponse<{ deletedCount: number }> => {
    try {
      const media = await Media.deleteOne({ _id });
      console.log(media);
      if (media.deletedCount) {
        return {
          data: {
            deletedCount: media.deletedCount,
          },
        };
      }
      return { error: "No record found to deleted." };
    } catch (err) {
      console.log("ERROR executing deleteMedia function::", err);
      return { error: ERROR_MSG.UNDER_MAINTENANCE };
    }
  };
}

const mediaFunctions = new MediaFunctions();

export default mediaFunctions;
