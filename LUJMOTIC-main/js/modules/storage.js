export const getData = (key) => {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;

    try {
        return JSON.parse(rawValue);
    } catch (error) {
        console.warn(`LocalStorage key \'${key}\' contiene JSON inválido. Se eliminará y se retornará null.`);
        localStorage.removeItem(key);
        return null;
    }
};

export const saveData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getUsers = () => getData("users") || [];
export const saveUsers = (users) => saveData("users", users);

export const getCurrentUser = () => getData("currentUser");
export const saveCurrentUser = (user) => saveData("currentUser", user);
export const clearCurrentUser = () => localStorage.removeItem("currentUser");
