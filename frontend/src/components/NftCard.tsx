import { useCallback, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { MetadataType, NftType } from "../types/nft";
import { makeUrl } from "../utils/ipfs";
import { getMetadata } from "../services/nft.service";

const NftCard = ({ nft }: { nft: NftType }) => {
  const [metadata, setMetadata] = useState<MetadataType | boolean>();
  const [message, setMessage] = useState<string>();

  const init = useCallback(() => {
    if (nft.data.type === "image") {
      getMetadata(nft.data.ipnft)
        .then((response) => {
          setMetadata(response.data);
        })
        .catch((error) => {
          setMetadata(false);
          setMessage(error.response.data.message || error.message);
        });
    }
  }, [nft]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="col-lg=3 col-md-4 col-sm-6 col-xs-12">
      <div className="card mt-2">
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}

        {nft.data.type === "image" ? (
          !metadata ? (
            <p>Loading from IPFS...</p>
          ) : (
            typeof metadata === "object" && (
              <>
                <LazyLoadImage
                  alt={metadata.name}
                  width={"100%"}
                  height={"100%"}
                  src={makeUrl(metadata.image, true)}
                />
                <div>Name: {metadata.name}</div>
                <div>Description: {metadata.description}</div>
              </>
            )
          )
        ) : (
          <>
            <textarea
              defaultValue={nft.data.data.toString()}
              style={{ minHeight: 218 }}
              disabled
            />
            <div>Name: {nft.data.name}</div>
            <div>Description: {nft.data.description}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default NftCard;
