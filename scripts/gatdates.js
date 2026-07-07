function date() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dateString = `${month}/${day}/${year}`;
    document.getElementById("date").textContent = dateString;
}