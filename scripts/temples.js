const menuButton = document.querySelector(".hamburguer-menu");
const navigation = document.querySelector(".navbar");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");

    const menuIsOpen = navigation.classList.contains("open");

    menuButton.setAttribute("aria-expanded", menuIsOpen);
    menuButton.textContent = menuIsOpen ? "✕" : "☰";
});