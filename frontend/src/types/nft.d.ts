export type NftDataType = {
  ipnft: string;
  url: string;
};

export type NftType = {
  data: NftDataType | string;
  nftId: number;
  type: "image" | "text";
};

export type MetadataType = {
  name: string;
  description: string;
  image: string;
};
