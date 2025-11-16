export function initScrollAnimation(): void {
    window.addEventListener("scroll", () => {
        const elements = document.querySelectorAll(".fade-in");
        elements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < window.innerHeight) {
                (el as HTMLElement).classList.add("visible");
            }
        });
    });
}