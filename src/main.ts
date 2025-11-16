// Типи для елементів
const openBtn: HTMLElement | null = document.getElementById("openModal");
const modal: HTMLElement | null = document.getElementById("modal");
const closeBtn: HTMLElement | null = document.getElementById("closeModal");
const postsContainer: HTMLElement | null = document.getElementById("posts");

// Відкриття модалки
openBtn?.addEventListener("click", () => {
    modal!.style.display = "flex";
});

// Закриття модалки
closeBtn?.addEventListener("click", () => {
    modal!.style.display = "none";
});

// Подія scroll
window.addEventListener("scroll", () => {
    console.log("Scroll:", window.scrollY);
});

// Fetch API
async function loadPosts(): Promise<void> {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data: Array<{ title: string; body: string }> = await response.json();

    if (postsContainer) {
        postsContainer.innerHTML = data
            .slice(0, 5)
            .map(
                (post) => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                </div>`
            )
            .join("");
    }
}

loadPosts();