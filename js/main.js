import config from './config.js';

// https://www.rtcmulticonnection.org/docs/getting-started/
var app = new Vue({
  el: "#app",

  data: {
    socketurl: '',
    connection: null,
    roomId: "algun-id-unico",
    connected: false,
    roomId: "",
    counter: 0,
  },

  computed: {
    toShare() {
      const url = window.location;
      let result = `${url.origin}${url.pathname}?roomid=${this.roomId}`;
      if (this.socketURL) {
        result += `&socketurl=${this.socketURL}`;
      }
      return result;
    },
  },

  methods: {
    getQueryParam(name) {
      const paramsString = window.location.href.split("?");
      const searchParams = new URLSearchParams(paramsString[1]);
      return searchParams.has(name) ? searchParams.get(name) : false;
    },

    reloadWindow() {
      window.location.reload(true);
    },

    init() {
      const self = this;
      console.log("refs", this.$refs);

      this.roomId = this.getQueryParam("roomid");
      console.log("getQueryParam('roomid'):", this.roomId);

      const connection = (this.connection = new RTCMultiConnection());
      this.socketURL = this.getQueryParam("socketurl");
      connection.socketURL = this.socketURL || config.socketURL;
      // connection.socketURL = "https://rtcmulticonnection.herokuapp.com:443/";
      // connection.socketURL = "https://rulokoba.me:9001/";
      connection.session = {
        audio: false,
        video: true,
      };

      // https://www.rtcmulticonnection.org/docs/iceServers/
      connection.iceServers = [];
      connection.iceServers.push({
        urls: config.stunServerURL,
      });

      connection.iceServers.push({
        urls: config.turnServerURL,
        credential: config.iceServerPassword,
        username: config.iceServerUsername,
      });

      connection.onstream = function (event) {
        console.log("onstream");
        self.counter++;
        const video = event.mediaElement;

        if (event.type === "local") {
          console.log("Video: local");
          self.$refs["localVideoBox"].appendChild(video);
        }

        if (event.type === "remote") {
          console.log("Video: remote");
          self.$refs["remoteVideoBox"].appendChild(video);
        }
      };

      connection.onleave = function (event) {
        console.log("onleave");
        if (self.counter > 0) {
          self.counter--;
        }
      };

      this.roomId = this.roomId || connection.token();
    },

    openOrJoinRoom() {
      this.connected = true;
      this.connection.openOrJoin(this.roomId);
    },
  },

  mounted() {
    console.log("mounted");
    this.init();
  },
});
