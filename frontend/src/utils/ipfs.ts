export const makeUrl = (cid: string, flag?: boolean) =>
  flag
    ? `https://ipfs.io/ipfs/${cid.split("ipfs://")[1]}`
    : `https://ipfs.io/ipfs/${cid}/metadata.json`;
