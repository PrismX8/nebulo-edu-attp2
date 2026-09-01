const defaultSites = [
  {
    id: "nebulo",
    name: "Nebulo",
    url: "https://adc.school.dovereducation.org",
    channelName: "nebulo",
    room: "rxrhcicz",
    aiName: "Nebulo AI",
    verifiedOwners: ["prism8x", "nebulo_owner"]
  },
  {
    id: "platinum",
    name: "Platinum",
    url: "https://platniumunblocker.com",
    room: "platnium",
    aiName: "Platinum AI",
    verifiedOwners: ["platinum_owner"]
  }
];

const globalRoom = process.env.NETWORK_GLOBAL_ROOM || "globalb8alls";
const localSiteId = process.env.LOCAL_SITE_ID || "nebulo";

module.exports = {
  globalRoom,
  localSiteId,
  sites: defaultSites
};
