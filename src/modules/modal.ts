import { ModalId } from "../types/types";

export function openModal(id: ModalId): void {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}

export function closeModal(id: ModalId): void {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}