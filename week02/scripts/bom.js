// select elements from the DOM
const input = document.querySelector("#favchap");
const button = document.querySelector("button");
const list = document.querySelector("#list");

// Books of The Book of Mormon
const bookOfMormonBooks = [
	"1 Nephi",
	"2 Nephi",
	"Jacob",
	"Enos",
	"Jarom",
	"Omni",
	"Words of Mormon",
	"Mosiah",
	"Alma",
	"Helaman",
	"3 Nephi",
	"4 Nephi",
	"Mormon",
	"Ether",
	"Moroni"
];

// wait for button clicks
button.addEventListener("click", function () {
	// Check if the user entered something
    if (input.value != "") {
        
        //Adding : Validate input — Only accept Book of Mormon books // 
        const userEntry = input.value.trim();
		let validBook = false;

		for (const book of bookOfMormonBooks) {
			if (userEntry === book || userEntry.startsWith(book + " ")) {
				validBook = true;
				break;
			}
		}

		if (!validBook) {
			alert("Please enter a valid Book of Mormon book.");
			input.focus();
			return;
        }
        //-----------------------******------------------------------------//

		// create list item and give it the value of the input
		const li = document.createElement("li");
		li.textContent = input.value;
		// create a button and add a click event listener
		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "❌";
		deleteBtn.addEventListener("click", function () {
			list.removeChild(li);
			input.focus();
		});
		// add the button to the list item
		li.appendChild(deleteBtn);
		// OUTPUT: finally display the completed list item to the unordered list
		list.appendChild(li);
		// clear the user input field
		input.value = "";
	}
	// focus the user back to the input field
	input.focus();
});




