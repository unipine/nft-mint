import { useCallback, useEffect, useState } from "react";

import NftCard from "./NftCard";
import { getNfts } from "../services/nft.service";
import { NftType } from "../types/nft";

const Gallery = () => {
  const [nfts, setNfts] = useState<Array<NftType>>([]);

  const init = useCallback(() => {
    getNfts()
      .then((response) => {
        setNfts(response.data);
      })
      .catch((error) =>
        console.warn(error.response.data.message || error.message)
      );
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="col-md-12 row d-grid gap-2">
      {nfts.map((nft) => (
        <NftCard key={`nft-card-${nft.nftId}`} nft={nft} />
      ))}
    </div>
  );
};

export default Gallery;
