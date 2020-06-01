import config from './config.js';

// https://www.rtcmulticonnection.org/docs/getting-started/
var app = new Vue({
  el: "#app",

  data: {
    socketurl: '',
    turnServerUsername: '',
    turnServerPassword: '',
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
      if (this.turnServerUsername) {
        result += `&turnuser=${this.turnServerUsername}`;
      }
      if (this.turnServerPassword) {
        result += `&turnpass=${this.turnServerPassword}`;
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

      const supports = navigator.mediaDevices.getSupportedConstraints();
      var constraints = {};
      if (supports.width && supports.height) {
        constraints = {
          width: config.width || 640,
          height: config.height || 480,
        };
      }
      console.log("constraints", constraints);

      const connection = (this.connection = new RTCMultiConnection());

      // connection.applyConstraints({
      //   video: constraints,
      // });

      this.socketURL = this.getQueryParam("socketurl");
      connection.socketURL = this.socketURL || config.socketURL;
      // connection.socketURL = "https://rtcmulticonnection.herokuapp.com:443/";
      // connection.socketURL = "https://rulokoba.me:9001/";
      console.log("connection.socketURL", connection.socketURL);
      connection.session = {
        audio: false,
        video: true,
      };

      // https://www.rtcmulticonnection.org/docs/iceServers/
      connection.iceServers = [];
      const stunServers = config.stunServers || [];
      for (let server of stunServers) {
        console.log("stunServer", server);
        connection.iceServers.push({
          urls: server,
        });
      }

      this.turnServerUsername = this.getQueryParam("turnuser");
      this.turnServerPassword = this.getQueryParam("turnpass");
      console.log("turnServerConfig", {
        urls: config.turnServerURL,
        username: this.turnServerUsername || config.turnServerUsername,
        credential: this.turnServerPassword || config.turnServerPassword,
      });
      connection.iceServers.push({
        urls: config.turnServerURL,
        username: this.turnServerUsername || config.turnServerUsername,
        credential: this.turnServerPassword || config.turnServerPassword,
      });

      connection.onstream = function (event) {
        console.log("onstream");
        self.counter++;
        const video = event.mediaElement;

        if (event.type === "local") {
          console.log("Video: local");
          video.className += " local";
          self.$refs["localVideoBox"].appendChild(video);
        }

        if (event.type === "remote") {
          console.log("Video: remote");
          video.className += " remote";
          self.$refs["remoteVideoBox"].appendChild(video);
        }
        // self.$refs["videoBox"].appendChild(video);
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
