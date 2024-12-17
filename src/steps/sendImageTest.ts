import { Routes } from "discord-api-types/v10";

import { environment } from "../environment.js";

const endpoint = "https://discord.com/api/v10";

// Source as Base64
const imgSrc = await Bun.file("./src/steps/image.txt").text();

// Extract the MIME type from the Base64 string (the part before the comma)
const mimeTypeMatch = imgSrc.match(/^data:(.+?);base64,/);
const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "application/octet-stream"; // Fallback to a generic MIME type if not found

// Convert the Base64 string to binary data
const byteCharacters = atob(imgSrc.split(",")[1]); // Decode base64 data (remove the data URL part)
const byteArrays = [];

// Convert byteCharacters to byteArrays
for (let offset = 0; offset < byteCharacters.length; offset++) {
  const byte = byteCharacters.charCodeAt(offset);
  byteArrays.push(byte);
}

// Create a Blob from the byteArrays
const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType }); // Change the MIME type as necessary

const formData = new FormData();
formData.append("content", "Your Best Songs Image is here!");
formData.append("files", blob, "image.jpg");

const res = await fetch(
  endpoint + Routes.channelMessages(environment.CHANNEL_ID),
  {
    method: "POST",
    headers: {
      Authorization: `Bot ${environment.DISCORD_TOKEN}`,
    },
    body: formData,
  },
);

if (!res.ok) {
  console.error(`Discord API Failed ${res.status} ${res.statusText}`);
  console.error(await res.text());
}
