const settings = {
  BACKEND_URL: "http://localhost:1337",
  NAV_LINKS: [
    { path: "/home", label: "Home", public: true },
    { path: "/wallet", label: "Wallet", public: false },
    { path: "/mint", label: "Mint", public: false },
    { path: "/gallery", label: "NFT Gallery", public: true },
  ],
};

export default settings;
