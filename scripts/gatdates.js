const currentyear = document.querySelector("#currentyear");

const today = new Date();

currentyear.innerHTML = `<span id="currentyear"> @ ${today.getFullYear()} - Patrick Marcelo A. S. Armani - Brazil</span>`;

const modified = new Date();

const lasModified = document.getElementById("lastModified").innerHTML = document.lastModified;
