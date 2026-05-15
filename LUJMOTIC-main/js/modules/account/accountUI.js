import { getAccountInfo, updateAccount } from "./accountService.js";
import { lockBodyScroll, unlockBodyScroll } from "../modal.js";

const accountModal = document.getElementById("accountModal");
const accountForm = document.getElementById("accountForm");
const accountNameInput = document.getElementById("account-name");
const accountEmailInput = document.getElementById("account-email");
const accountRoleInput = document.getElementById("account-role");
const accountCreatedAtInput = document.getElementById("account-createdAt");
const accountPasswordInput = document.getElementById("account-password");
const accountPasswordConfirmInput = document.getElementById("account-password-confirm");
const accountError = document.getElementById("accountError");
const accountSaveBtn = document.getElementById("accountSaveBtn");
const closeAccountModalBtn = document.getElementById("closeAccountModal");

const formatMemberDate = (isoDate) => {
    try {
        const date = new Date(isoDate);
        return isNaN(date.getTime()) ? "—" : date.getFullYear();
    } catch {
        return "—";
    }
};

const showAccountError = (message) => {
    if (!accountError) return;
    accountError.textContent = message;
    accountError.style.opacity = message ? "1" : "0";
};

const handleEscapeClose = (event) => {
    if (event.key === "Escape") {
        closeAccountModal();
    }
};

const resetAccountFields = () => {
    if (accountPasswordInput) accountPasswordInput.value = "";
    if (accountPasswordConfirmInput) accountPasswordConfirmInput.value = "";
    showAccountError("");
};

export const openAccountModal = () => {
    const account = getAccountInfo();
    if (!account || !accountModal) return;

    if (accountNameInput) accountNameInput.value = account.name || "";
    if (accountEmailInput) accountEmailInput.value = account.email || "";
    if (accountRoleInput) accountRoleInput.value = account.role || "Cliente";
    if (accountCreatedAtInput) accountCreatedAtInput.value = formatMemberDate(account.createdAt);

    resetAccountFields();
    accountModal.style.display = "flex";
    lockBodyScroll();
    window.addEventListener("keydown", handleEscapeClose);
};

export const closeAccountModal = () => {
    if (accountModal) {
        accountModal.style.display = "none";
    }
    unlockBodyScroll();
    window.removeEventListener("keydown", handleEscapeClose);
    showAccountError("");
};

const validateAccountForm = () => {
    const name = accountNameInput?.value.trim();
    const password = accountPasswordInput?.value.trim();
    const confirm = accountPasswordConfirmInput?.value.trim();

    if (!name) {
        showAccountError("El nombre no puede estar vacío.");
        return false;
    }

    if (password || confirm) {
        if (password.length < 6) {
            showAccountError("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }

        if (password !== confirm) {
            showAccountError("Las contraseñas no coinciden.");
            return false;
        }
    }

    showAccountError("");
    return true;
};

const handleAccountSave = () => {
    if (!validateAccountForm()) return;

    const account = getAccountInfo();
    if (!account) return;

    const name = accountNameInput?.value.trim();
    const password = accountPasswordInput?.value.trim();

    try {
        const updated = updateAccount({
            email: account.email,
            name,
            password: password || undefined,
        });

        if (accountNameInput) accountNameInput.value = updated.name;
        if (accountEmailInput) accountEmailInput.value = updated.email;
        if (accountRoleInput) accountRoleInput.value = updated.role;
        if (accountCreatedAtInput) accountCreatedAtInput.value = formatMemberDate(updated.createdAt);

        closeAccountModal();
        window.showUserDropdown?.(updated);
    } catch (error) {
        showAccountError(error.message || "No se pudo actualizar el perfil.");
    }
};

if (closeAccountModalBtn) {
    closeAccountModalBtn.addEventListener("click", closeAccountModal);
}

if (accountModal) {
    accountModal.addEventListener("click", (event) => {
        if (event.target === accountModal) {
            closeAccountModal();
        }
    });
}

if (accountForm) {
    accountForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handleAccountSave();
    });
}

if (accountSaveBtn) {
    accountSaveBtn.addEventListener("click", handleAccountSave);
}
