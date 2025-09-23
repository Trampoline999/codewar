import axiosInstance from "../lib/axios.js";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      //console.log("checking response data",res.data);
      set({ authUser: res.data.user });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      //console.log("checking response data",res.data);

      set({ authUser: res.data.user });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signUp: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      //console.log("checking response data",res.data);
      set({ authUser: res.data.user });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isSigninUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      // toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      // toast.error("Error logging out");
    }
  },
}));
