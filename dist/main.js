"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Типи для елементів
const openBtn = document.getElementById("openModal");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeModal");
const postsContainer = document.getElementById("posts");
// Відкриття модалки
openBtn === null || openBtn === void 0 ? void 0 : openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});
// Закриття модалки
closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});
// Подія scroll
window.addEventListener("scroll", () => {
    console.log("Scroll:", window.scrollY);
});
// Fetch API
function loadPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://jsonplaceholder.typicode.com/posts");
        const data = yield response.json();
        if (postsContainer) {
            postsContainer.innerHTML = data
                .slice(0, 5)
                .map((post) => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                </div>`)
                .join("");
        }
    });
}
loadPosts();
