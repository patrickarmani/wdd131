const currentyear = document.querySelector("#currentyear");

const today = new Date();

currentyear.innerHTML = `<span id="currentyear"> \u00A9 ${today.getFullYear()} - Patrick Marcelo A. S. Armani - Brazil</span>`;



const lasModified = document.getElementById("lastModified").innerHTML = document.lastModified;
