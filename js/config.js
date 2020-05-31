const config = {
  socketURL: "https://rtcmulticonnection.herokuapp.com:443/",
  stunServers: [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302",
    "stun:stun3.l.google.com:19302",
    "stun:stun4.l.google.com:19302",
  ],
  turnServerURL: "turn:numb.viagenie.ca",
  turnServerUsername: "akobashikawa@gmail.com",
  turnServerPassword: "*N70m0d4ch13",
  width: 640,
  heigth: 480,
};
export default config;