export type MediaPayloadT = {
  name: string;
  description?: string;
  source: string;
};

export type MediaDto = {
  _id: string;
  name: string;
  description: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};
