// coded by sina-yeganeh
// (C) 2021 - 2022
// github: https://github.com/sina-yeganeh/
// use code just with reference address is possible

const price   = require("crypto-price")
    , blessed = require("blessed")
    , contrib = require("blessed-contrib")
    , colors = require("colors")
    , notifier = require("node-notifier")
    , NetworkSpeed = require("network-speed")
    , config  = require("./config.js");

const screen = blessed.screen();
const grid = new contrib.grid({ rows: 10, cols: 10, screen: screen });

const line_chart = grid.set(2, 3, 8, 7, contrib.line, config.line);
const log = grid.set(2, 0, 7, 3, contrib.log, config.log);
const help = grid.set(0, 3, 2, 5, contrib.log, config.help);
const banner = grid.set(0, 0, 2, 3, contrib.log, config.banner);
const networkLogger = grid.set(0, 8, 2, 2, contrib.log, config.donut);
const dev = grid.set(9, 0, 1, 3, contrib.log, config.dev);

function printBanner() {
  for (var i = 0; i <= config.bannerList.length - 1; i++) {
    banner.log(`${config.bannerList[i]}\n`.yellow);
  }
}

function printHelpTexts() {
  help.log(colors.bold("Welcome to BTC terminal trader app!".blue) + " Press " + colors.bold("\"h\"".green) + " to see help list");
  help.log("Press " + colors.bold("\"q\"".green) + " to exit(quit) from app and back to the terminal");
  help.log("App automatically update chart if bitcoin price increase or decrease");
  help.log(colors.bold("You can drag boxes(windows) and move it to other side"));

  dev.log(colors.bold.italic("Sina yeganeh - check out my Github".red));
}

// TODO: Network Speed Test
// const testNetworkSpeed = new NetworkSpeed();
// setInterval(async () => {
//   const networkSpeed = await testNetworkSpeed.checkDownloadSpeed(config.networkSpeedTestUrl, 400000)
//   log.log(colors.bold.italic(" network speed: ".blue + String(networkSpeed.kbps).bgWhite.black));
  
//   const speedKbps = networkSpeed.kbps;
//   const percent = config.donut.data[0].percent;
//   const color = config.donut.data[0].color;
//   if (speedKbps >= 5000) {
//     percent = 90
//     color = "green"
//   } else if (speedKbps >= 2500 && speedKbps <= 5000) {
//     color = "yellow";
//     const percentInterval = setInterval(() => {
//       if (percent <= 20) percent++;
//       else if (percent >= 90) percent--;
//       else clearInterval(percentInterval);
//     }, 200)
//   }
// }, 5000)

var networkColor = colors.green;
const testNetworkSpeed = new NetworkSpeed();
setInterval(async () => {
  const networkSpeed = await testNetworkSpeed.checkDownloadSpeed(config.networkSpeedTestUrl, 400000)
  
  const networkSpeedKbps = Number(networkSpeed);
  if (networkSpeedKbps >= 2700) networkColor = colors.green;
  else if (networkSpeedKbps <= 2700 && networkSpeedKbps >= 1000) networkColor = colors.yellow;
  else networkColor = colors.red;
  networkLogger.log(colors.bold.italic(" network speed: ".blue + networkSpeed.kbps));
}, 5000);

const bitcoinPrices = [];
var lastPrice = 0;
var lastPriceExact = 0;
var hours = [];

printHelpTexts();
printBanner();
setInterval(() => {
  var date = new Date();
  var hour = date.getHours();
  var i = 0;

  for (var number = -2; number <= 2; number++) {
    if (i <= 4) {
      hours[i] = String(hour + number);
      i++
    } else break;
  }

  price.getCryptoPrice("USD", "BTC")
    .then(btc => {
      lastPriceExact = btc.price;
      var btcPrice = Math.floor(lastPriceExact);

      config.line.maxY = btcPrice + 100;
      config.line.minY = btcPrice - 100;

      if (btcPrice != lastPrice) {
        var dif = btcPrice - lastPrice;
        if (dif > 0) {
          config.line.style.baseline = "green";
          log.log(
            colors.bold(
              " bitcoin".yellow + " changed ".white + "+".green + String(dif).green + " (".white + String(lastPrice).red + " to ".white + String(btcPrice).red + ")".white
            )
          );
        } else {
          config.line.style.baseline = "red";
          log.log(
            colors.bold(
              " bitcoin".yellow + " changed ".white + String(dif).red + " (".white + String(lastPrice).red + " to ".white + String(btcPrice).red + ")".white
            )
          );
        }

        if (bitcoinPrices.length >= 5) bitcoinPrices.shift();
        bitcoinPrices.push(btcPrice);
        lastPrice = btcPrice;

        line_chart.setData({
          title: 'BTC',
          x: config.x,
          y: bitcoinPrices
        })
        screen.render();

        notifier.notify({
          "title": "BTC Price Changed!",
          "message": "becareful! bitcoin price changed, Watch your chart."
        })
      }
    })
    .catch(err => {
      log.log(" " + colors.bold(err.red));
      notifier.notify({
        "title": "Error!",
        "message": "can't get BTC data from API, see log box."
      });
    })
}, 1000);

screen.key(['q'], function() {
  process.exit(0);
})

screen.render();

module.exports = {
  screen: screen
}
