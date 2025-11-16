import { openModal, closeModal } from "./modal";

export function initClickEvents(): void {
    document.querySelectorAll(".open-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-modal-id");
            if (target) openModal(target);
        });
    });

    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-modal-id");
            if (target) closeModal(target);
        });
    });
}