export type NftImageType = {
  type: "image";
  ipnft: string;
  url: string;
};

export type NftTextType = {
  type: "text";
  data: string;
  name: string;
  description: string;
}

export type NftType = {
  data: NftImageType | NftTextType;
  nftId: number;
};

export type MetadataType = {
  name: string;
  description: string;
  image: string;
};
