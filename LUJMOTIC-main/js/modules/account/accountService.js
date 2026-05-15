import { getUsers, saveUsers, getCurrentUser, saveCurrentUser } from "../storage.js";

export const getAccountInfo = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const users = getUsers();
    const currentIndex = users.findIndex((user) => user.email === currentUser.email);
    const storedUser = currentIndex !== -1 ? users[currentIndex] : null;
    const accountUser = {
        ...storedUser,
        ...currentUser,
        createdAt: currentUser.createdAt || storedUser?.createdAt || new Date().toISOString(),
    };

    if (!accountUser.createdAt) {
        accountUser.createdAt = new Date().toISOString();
    }

    if (currentIndex !== -1 && !users[currentIndex].createdAt) {
        users[currentIndex] = { ...users[currentIndex], createdAt: accountUser.createdAt };
        saveUsers(users);
    }

    if (!currentUser.createdAt) {
        saveCurrentUser(accountUser);
    }

    return accountUser;
};

export const updateAccount = ({ email, name, password }) => {
    const users = getUsers();
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
        throw new Error("Usuario no encontrado.");
    }

    const existing = users[userIndex];
    const updatedUser = {
        ...existing,
        name: name || existing.name,
        password: password || existing.password,
        createdAt: existing.createdAt || new Date().toISOString(),
    };

    users[userIndex] = updatedUser;
    saveUsers(users);
    saveCurrentUser(updatedUser);

    return updatedUser;
};