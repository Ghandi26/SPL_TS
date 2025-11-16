import { ApiData } from "../types/types";

export async function fetchData(): Promise<void> {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data: ApiData[] = await response.json();
    const container = document.getElementById("data-container");
    if (container) {
        container.innerHTML = data.slice(0, 5).map(item =>
            `<div class="post"><h3>${item.title}</h3><p>${item.body}</p></div>`
        ).join("");
    }
}