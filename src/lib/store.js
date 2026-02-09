import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Mock users for demo
const mockUsers = [
    {
        id: '1',
        fullName: 'Rahul Sharma',
        mobile: '9876543210',
        email: 'rahul@example.com',
        language: 'en',
        mpin: '1234',
    },
];
// Auth Store
export const useAuthStore = create()(persist((set, get) => ({
    user: null,
    isAuthenticated: false,
    language: 'en',
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setLanguage: (language) => {
        set({ language });
        const user = get().user;
        if (user) {
            set({ user: { ...user, language } });
        }
    },
    login: (mobile, mpin) => {
        const users = JSON.parse(localStorage.getItem('scheme-sarthi-users') || '[]');
        const allUsers = [...mockUsers, ...users];
        const user = allUsers.find((u) => u.mobile === mobile && u.mpin === mpin);
        if (user) {
            set({ user, isAuthenticated: true, language: user.language });
            return true;
        }
        return false;
    },
    loginWithOtp: (mobile) => {
        const users = JSON.parse(localStorage.getItem('scheme-sarthi-users') || '[]');
        const allUsers = [...mockUsers, ...users];
        const user = allUsers.find((u) => u.mobile === mobile);
        if (user) {
            set({ user, isAuthenticated: true, language: user.language });
            return true;
        }
        return false;
    },
    register: (userData) => {
        const users = JSON.parse(localStorage.getItem('scheme-sarthi-users') || '[]');
        const exists = [...mockUsers, ...users].some((u) => u.mobile === userData.mobile);
        if (exists)
            return false;
        const newUser = {
            ...userData,
            id: Date.now().toString(),
        };
        users.push(newUser);
        localStorage.setItem('scheme-sarthi-users', JSON.stringify(users));
        set({ user: newUser, isAuthenticated: true, language: newUser.language });
        return true;
    },
    logout: () => set({ user: null, isAuthenticated: false }),
    updateProfile: (data) => {
        const user = get().user;
        if (user) {
            const updatedUser = { ...user, ...data };
            set({ user: updatedUser });
            // Update in localStorage
            const users = JSON.parse(localStorage.getItem('scheme-sarthi-users') || '[]');
            const index = users.findIndex((u) => u.id === user.id);
            if (index !== -1) {
                users[index] = updatedUser;
                localStorage.setItem('scheme-sarthi-users', JSON.stringify(users));
            }
        }
    },
}), {
    name: 'scheme-sarthi-auth',
}));
// Application Store
export const useApplicationStore = create()(persist((set, get) => ({
    applications: [],
    addApplication: (appData) => {
        const newApp = {
            ...appData,
            id: `APP${Date.now()}`,
            dateApplied: new Date().toISOString(),
            status: 'submitted',
        };
        set((state) => ({
            applications: [...state.applications, newApp],
        }));
        return newApp;
    },
    updateStatus: (id, status) => {
        set((state) => ({
            applications: state.applications.map((app) => app.id === id ? { ...app, status } : app),
        }));
    },
    getApplicationsByUser: (userId) => {
        return get().applications.filter((app) => app.userId === userId);
    },
}), {
    name: 'scheme-sarthi-applications',
}));
// Notification Store
export const useNotificationStore = create()(persist((set, get) => ({
    notifications: [
        {
            id: '1',
            userId: '1',
            title: 'New Scheme Available',
            message: 'PM Kisan Samman Nidhi is now accepting applications for the next quarter.',
            type: 'scheme',
            read: false,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: '2',
            userId: '1',
            title: 'Important Announcement',
            message: 'Aadhaar linking deadline extended for EPF accounts.',
            type: 'announcement',
            read: false,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
    ],
    addNotification: (notifData) => {
        const newNotif = {
            ...notifData,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
        };
        set((state) => ({
            notifications: [newNotif, ...state.notifications],
        }));
    },
    markAsRead: (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
        }));
    },
    getNotificationsByUser: (userId) => {
        return get().notifications.filter((n) => n.userId === userId);
    },
}), {
    name: 'scheme-sarthi-notifications',
}));
