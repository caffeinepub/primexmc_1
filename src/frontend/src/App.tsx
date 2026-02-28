import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import StorePage from "./pages/StorePage";

type Page = "login" | "store";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [username, setUsername] = useState<string>("");

  const handleLogin = (name: string) => {
    setUsername(name);
    setPage("store");
  };

  const handleLogout = () => {
    setUsername("");
    setPage("login");
  };

  return (
    <div className="min-h-screen mc-bg">
      {page === "login" && <LoginPage onLogin={handleLogin} />}
      {page === "store" && (
        <StorePage username={username} onLogout={handleLogout} />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.01 260)",
            border: "2px solid oklch(0.62 0.2 152)",
            color: "oklch(0.92 0.01 100)",
            fontFamily: "'Geist Mono', monospace",
            fontSize: "13px",
            borderRadius: "2px",
            boxShadow:
              "0 4px 20px oklch(0 0 0 / 0.6), 0 0 20px oklch(0.62 0.2 152 / 0.2)",
          },
        }}
      />
    </div>
  );
}
