// coded by sina-yeganeh
// (C) 2021 - 2022
// github: https://github.com/sina-yeganeh/
// use code just with reference address is possible

const app = require("./app.js");

module.exports = {
  line: {
    style: {
      line: "yellow",
      text: "white",
      baseline: "green"
    },
    label: "Line Chart Prices (USD)",
    showLegend: true,
    minY: 39000,
    maxY: 35000,
    draggable: true
  },
  log: {
    label: "Logger",
    draggable: true
  },
  help: {
    label: "Help",
    fg: "white",
    draggable: true
  },
  banner: {
    label: "Banner",
    draggable: true
  },
  donut: {
    label: "Netword Speed (kbps)",
    draggable: true
  },
  dev: {
    label: "Developer",
    draggable: true
  },
  bannerList: ["   _____  _______            _               ",
                "  / _ \\ \\/ /_   _| _ __ _ __| |___ _ _     ",
                " | (_) >  <  | || '_/ _` / _` / -_) '_|      ",
                "  \\___/_/\\_\\ |_||_| \\__,_\\__,_\\___|_|  ",
                "                                 V1.2        "],
  networkSpeedTestUrl: "https://httpbin.org/stream-bytes/400000",
  x: ["t1", "t2", "t3", "t4", "t5", "t6"],
};