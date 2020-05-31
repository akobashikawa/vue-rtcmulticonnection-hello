const config = {
  socketURL: "https://rtcmulticonnection.herokuapp.com:443/",
  stunServers: [
    "stun.l.google.com:19302",
    "stun1.l.google.com:19302",
    "stun2.l.google.com:19302",
    "stun3.l.google.com:19302",
    "stun4.l.google.com:19302",
  ],
  turnServerURL: "numb.viagenie.ca",
  turnServerUsername: "secret",
  turnServerPassword: "secret",
};
export default config;