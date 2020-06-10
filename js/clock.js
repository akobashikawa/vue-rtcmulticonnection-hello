const ClockComponent = {
  name: "clock",

  data() {
    return {
      time: "",
    };
  },

  methods: {
    updateTime() {
      this.time = moment().format("hh:mm:ss A");
    },
  },

  mounted() {
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },

  template: `<b-badge variant="light">{{ time }}</b-badge>`,
};

export default ClockComponent;
