"use client";
import { Fetcher } from "swr";
import { apiUrls } from "@/constants";
import { getDefaultHeaders } from ".";
import { AddMediaPayloadT, MediaDto } from "../types/media.types";

class MediaRequests {
  constructor() {
    console.log("Media requests::");
  }

  addMedia = async (payload: AddMediaPayloadT) => {
    try {
      const resp = await fetch(apiUrls.media, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { ...getDefaultHeaders() },
      });
      const data = await resp?.json();
      return data;
    } catch (err) {
      console.log("Failed to addMedia fun::", err);
      return null;
    }
  };

  fetchMedia: Fetcher<MediaDto[], string> = async (apiPath) => {
    try {
      const resp = await fetch(apiPath, {
        method: "GET",
        headers: { ...getDefaultHeaders() },
      });
      const data = await resp.json();
      return data?.media || [];
    } catch (err) {
      console.log("ERROR fetching media data::", err);
      return [];
    }
  };

  deleteMedia = async (id: string) => {
    const resp = await fetch(`${apiUrls.media}/${id}`, {
      method: "DELETE",
      headers: getDefaultHeaders(),
    });
    const data = await resp.json();
    return data;
  };

  renameMedia = async (id: string, name: string) => {
    const resp = await fetch(`${apiUrls.media}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
      headers: getDefaultHeaders(),
    });
    const data = await resp.json();
    return data;
  };
}

const mediaRequests = new MediaRequests();

export default mediaRequests;
