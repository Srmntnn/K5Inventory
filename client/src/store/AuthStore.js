import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
                email,
                password,
                name
            });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || 'Error Signing up', isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
                { email, password },
                { withCredentials: true } // Ensure cookies are sent
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Login failed");
            }

            const user = response.data.user;

            localStorage.setItem("user", JSON.stringify(user));

            set({
                isAuthenticated: true,
                user,
                error: null,
                isLoading: false,
            });

        } catch (error) {
            set({
                error: error.message || "Error logging in",
                isLoading: false,
            });
            throw error;
        }
    },


    logout: async () => {
        set({ isLoading: true, error: null });
    
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`); // Ensure backend clears session
    
            // Remove user data from localStorage
            localStorage.removeItem("user");
    
            // Clear the user data and reset authentication state
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
            });
    
            // Check if the user is logged out
            const user = localStorage.getItem("user");
            if (!user) {
                console.log("User is logged out (localStorage cleared).");
            } else {
                console.log("Logout failed, user data still in localStorage.");
            }
    
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },
    

}));