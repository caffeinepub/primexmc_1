import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useState } from "react";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter your Minecraft username.");
      return;
    }
    if (trimmed.length < 3 || trimmed.length > 16) {
      setError("Username must be 3–16 characters.");
      return;
    }
    setError("");
    onLogin(trimmed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background pixel decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Corner pixel blocks */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-mc-green opacity-20" />
        <div className="absolute top-0 left-8 w-8 h-8 bg-mc-green opacity-10" />
        <div className="absolute top-8 left-0 w-8 h-8 bg-mc-green opacity-10" />
        <div className="absolute top-0 right-0 w-8 h-8 bg-mc-gold opacity-20" />
        <div className="absolute top-0 right-8 w-8 h-8 bg-mc-gold opacity-10" />
        <div className="absolute top-8 right-0 w-8 h-8 bg-mc-gold opacity-10" />
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-mc-green opacity-20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-mc-gold opacity-20" />

        {/* Floating particle pixels */}
        {(
          [
            "p0",
            "p1",
            "p2",
            "p3",
            "p4",
            "p5",
            "p6",
            "p7",
            "p8",
            "p9",
            "p10",
            "p11",
          ] as const
        ).map((id, i) => (
          <motion.div
            key={id}
            className="absolute w-2 h-2"
            style={{
              left: `${5 + ((i * 8.5) % 90)}%`,
              top: `${10 + ((i * 13) % 80)}%`,
              background:
                i % 3 === 0
                  ? "oklch(0.62 0.2 152)"
                  : i % 3 === 1
                    ? "oklch(0.78 0.16 80)"
                    : "oklch(0.72 0.15 200)",
              opacity: 0.15 + (i % 4) * 0.08,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.15 + (i % 4) * 0.08, 0.35, 0.15 + (i % 4) * 0.08],
            }}
            transition={{
              duration: 3 + (i % 3),
              delay: (i * 0.4) % 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <div className="relative">
            <img
              src="/assets/generated/primexmc-logo-transparent.dim_400x120.png"
              alt="PrimeXmc"
              className="w-72 h-auto drop-shadow-[0_0_24px_oklch(0.62_0.2_152/0.5)]"
              onError={(e) => {
                // Fallback text logo if image fails
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Fallback text logo */}
            <div className="text-center hidden" id="text-logo-fallback">
              <span
                className="mc-pixel text-4xl"
                style={{
                  color: "oklch(0.62 0.2 152)",
                  textShadow: "0 0 20px oklch(0.62 0.2 152 / 0.5)",
                }}
              >
                Prime
              </span>
              <span
                className="mc-pixel text-4xl"
                style={{
                  color: "oklch(0.78 0.16 80)",
                  textShadow: "0 0 20px oklch(0.78 0.16 80 / 0.5)",
                }}
              >
                Xmc
              </span>
            </div>
          </div>
        </motion.div>

        {/* Store tagline */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.62 0.2 152 / 0.5))",
              }}
            />
            <Sparkles
              className="w-4 h-4"
              style={{ color: "oklch(0.78 0.16 80)" }}
            />
            <div
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(to left, transparent, oklch(0.62 0.2 152 / 0.5))",
              }}
            />
          </div>
          <p
            className="mc-pixel text-xs"
            style={{ color: "oklch(0.55 0.01 260)" }}
          >
            OFFICIAL SERVER STORE
          </p>
        </motion.div>

        {/* Login card */}
        <motion.div
          className="mc-card rounded-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Card header */}
          <div className="mb-6">
            <div
              className="mc-pixel text-sm mb-1"
              style={{ color: "oklch(0.78 0.16 80)" }}
            >
              WELCOME BACK
            </div>
            <h1
              className="mc-pixel text-xl"
              style={{ color: "oklch(0.92 0.01 100)" }}
            >
              LOGIN TO STORE
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="mc-pixel text-xs"
                style={{ color: "oklch(0.62 0.2 152)" }}
              >
                MINECRAFT USERNAME
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "oklch(0.55 0.01 260)" }}
                />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your IGN..."
                  className="pl-10 rounded-sm border-0 mc-pixel text-xs h-12"
                  style={{
                    background: "oklch(0.1 0.012 280)",
                    border: "2px solid oklch(0.28 0.015 260)",
                    color: "oklch(0.92 0.01 100)",
                    outline: "none",
                    boxShadow: "inset 2px 2px 0 oklch(0 0 0 / 0.4)",
                  }}
                  maxLength={16}
                  autoComplete="username"
                  autoFocus
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.62 0.2 152)";
                    e.currentTarget.style.boxShadow =
                      "inset 2px 2px 0 oklch(0 0 0 / 0.4), 0 0 0 2px oklch(0.62 0.2 152 / 0.25)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "oklch(0.28 0.015 260)";
                    e.currentTarget.style.boxShadow =
                      "inset 2px 2px 0 oklch(0 0 0 / 0.4)";
                  }}
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mc-pixel text-xs"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                  role="alert"
                >
                  ⚠ {error}
                </motion.p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="mc-btn mc-pixel w-full h-12 text-xs font-bold flex items-center justify-center gap-2 rounded-sm"
              style={{
                background: "oklch(0.62 0.2 152)",
                color: "oklch(0.08 0.005 260)",
                cursor: "pointer",
              }}
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Tip */}
          <p
            className="mt-6 text-center text-xs"
            style={{ color: "oklch(0.4 0.01 260)", fontFamily: "monospace" }}
          >
            Enter your in-game Minecraft name
          </p>
        </motion.div>

        {/* Version badge */}
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span
            className="mc-pixel text-xs px-3 py-1"
            style={{
              background: "oklch(0.16 0.01 260)",
              border: "1px solid oklch(0.28 0.015 260)",
              color: "oklch(0.4 0.01 260)",
              borderRadius: "2px",
            }}
          >
            JAVA & BEDROCK ◆ 1.21.x
          </span>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-4 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p
          className="text-xs"
          style={{ color: "oklch(0.35 0.01 260)", fontFamily: "monospace" }}
        >
          © {new Date().getFullYear()} PrimeXmc. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "oklch(0.62 0.2 152)" }}
            className="hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </motion.footer>
    </div>
  );
}
