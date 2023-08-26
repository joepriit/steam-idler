const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const config = require("./config.js");
const user = new SteamUser();

if (config.auto2FA) {
  user.logOn({
    accountName: config.username,
    password: config.password,
    twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret),
  });
}

if (!config.auto2FA) {
  user.logOn({
    accountName: config.username,
    password: config.password,
  });
}

function update(initial = false) {
  if (initial) {
    user.gamesPlayed(config.gameId);
    console.log(`Bot started idling...`);
  }

  const uptimeInSeconds = process.uptime();
  const secondsPerMinute = 60;
  const secondsPerHour = 60 * secondsPerMinute;
  const secondsPerDay = 24 * secondsPerHour;

  const days = Math.floor(uptimeInSeconds / secondsPerDay);
  const hours = Math.floor((uptimeInSeconds % secondsPerDay) / secondsPerHour);
  const minutes = Math.floor(
    (uptimeInSeconds % secondsPerHour) / secondsPerMinute
  );
  const seconds = Math.floor(uptimeInSeconds % secondsPerMinute);
  const formatted = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

  console.log(`Idle for: ${formatted}`);
}

user.on("loggedOn", () => {
  user.setPersona(1);
  console.log("Signed into steam...");
  update(true);
});

setInterval(update, config.updateInterval);
