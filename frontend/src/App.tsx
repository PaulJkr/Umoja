import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./context/authStore";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const App = () => {
  const { isLoading, loadUserFromStorage } = useAuthStore();

  // Load user on first render
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-center" />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
