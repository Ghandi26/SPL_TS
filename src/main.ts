import { initClickEvents } from "./modules/click";
import { initScrollAnimation } from "./modules/scroll";
import { fetchData } from "./modules/fetch";

document.addEventListener("DOMContentLoaded", () => {
    initClickEvents();
    initScrollAnimation();
    fetchData();
});