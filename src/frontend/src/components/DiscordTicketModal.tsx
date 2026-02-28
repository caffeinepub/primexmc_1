import { Check, Copy, ExternalLink, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export interface TicketItem {
  name: string;
  type: "Rank" | "Crate Key";
  price: number;
  quantity?: number;
}

interface DiscordTicketModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
  item: TicketItem | null;
}

const DISCORD_INVITE = "https://discord.gg/primexmc";

// Discord logo SVG inline
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963a.075.075 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
    </svg>
  );
}

export default function DiscordTicketModal({
  open,
  onClose,
  username,
  item,
}: DiscordTicketModalProps) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const totalPrice =
    item.type === "Crate Key" && item.quantity != null
      ? (item.price * item.quantity).toFixed(2)
      : item.price.toFixed(2);

  const ticketMessage = [
    "📋 PrimeXmc Purchase Request",
    "",
    `Username: ${username}`,
    `Item: ${item.name}`,
    `Type: ${item.type}`,
    ...(item.type === "Crate Key" && item.quantity != null
      ? [`Quantity: ${item.quantity}`]
      : []),
    `Price: $${totalPrice}`,
    "",
    "Please process my order. Thank you!",
  ].join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ticketMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = ticketMessage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenDiscord = () => {
    window.open(DISCORD_INVITE, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "oklch(0 0 0 / 0.75)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <dialog
              aria-label="Discord ticket"
              open
              className="relative w-full max-w-md rounded-sm overflow-hidden bg-transparent border-0 p-0 m-0"
              style={{
                background: "oklch(0.13 0.012 280)",
                border: "2px solid oklch(0.28 0.015 260)",
                boxShadow:
                  "0 8px 40px oklch(0 0 0 / 0.6), inset 2px 2px 0 oklch(1 0 0 / 0.03)",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {/* Header bar */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{
                  background: "oklch(0.16 0.015 280)",
                  borderBottom: "1px solid oklch(0.28 0.015 260)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-sm flex items-center justify-center"
                    style={{
                      background: "oklch(0.44 0.25 265 / 0.2)",
                      border: "1.5px solid oklch(0.44 0.25 265 / 0.5)",
                    }}
                  >
                    <DiscordIcon
                      className="w-4 h-4"
                      // inline style so we avoid extra token classes
                    />
                  </div>
                  <div>
                    <p
                      className="mc-pixel text-xs"
                      style={{ color: "oklch(0.92 0.01 100)" }}
                    >
                      OPEN A DISCORD TICKET
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        color: "oklch(0.45 0.01 260)",
                        fontFamily: "monospace",
                      }}
                    >
                      Copy the message below &amp; paste in #tickets
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors"
                  style={{ color: "oklch(0.5 0.01 260)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "oklch(0.65 0.22 25 / 0.15)";
                    e.currentTarget.style.color = "oklch(0.65 0.22 25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "oklch(0.5 0.01 260)";
                  }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order summary */}
              <div className="px-5 pt-4 pb-2">
                <p
                  className="mc-pixel text-xs mb-3"
                  style={{ color: "oklch(0.55 0.01 260)" }}
                >
                  ORDER SUMMARY
                </p>
                <div
                  className="rounded-sm p-3 flex flex-col gap-1.5"
                  style={{
                    background: "oklch(0.1 0.01 280)",
                    border: "1px solid oklch(0.22 0.01 260)",
                  }}
                >
                  {[
                    ["Username", username],
                    ["Item", item.name],
                    ["Type", item.type],
                    ...(item.type === "Crate Key" && item.quantity != null
                      ? [["Quantity", String(item.quantity)]]
                      : []),
                    ["Price", `$${totalPrice}`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span
                        className="text-xs"
                        style={{
                          color: "oklch(0.45 0.01 260)",
                          fontFamily: "monospace",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        className="mc-pixel text-xs"
                        style={{ color: "oklch(0.82 0.01 100)" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticket message preview */}
              <div className="px-5 pt-3 pb-2">
                <p
                  className="mc-pixel text-xs mb-2"
                  style={{ color: "oklch(0.55 0.01 260)" }}
                >
                  TICKET MESSAGE
                </p>
                <pre
                  className="text-xs p-3 rounded-sm whitespace-pre-wrap break-words leading-relaxed"
                  style={{
                    background: "oklch(0.08 0.01 280)",
                    border: "1px solid oklch(0.22 0.01 260)",
                    color: "oklch(0.75 0.01 100)",
                    fontFamily: "monospace",
                  }}
                >
                  {ticketMessage}
                </pre>
              </div>

              {/* Actions */}
              <div className="px-5 pt-3 pb-5 flex flex-col sm:flex-row gap-2.5">
                {/* Copy button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 h-10 flex items-center justify-center gap-2 rounded-sm mc-pixel text-xs transition-all"
                  style={{
                    background: copied
                      ? "oklch(0.58 0.18 152)"
                      : "oklch(0.52 0.18 152 / 0.2)",
                    border: `1.5px solid ${copied ? "oklch(0.62 0.2 152)" : "oklch(0.52 0.18 152 / 0.5)"}`,
                    color: copied
                      ? "oklch(0.08 0.005 260)"
                      : "oklch(0.72 0.2 152)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!copied) {
                      e.currentTarget.style.background =
                        "oklch(0.52 0.18 152 / 0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copied) {
                      e.currentTarget.style.background =
                        "oklch(0.52 0.18 152 / 0.2)";
                    }
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY MESSAGE</span>
                    </>
                  )}
                </button>

                {/* Open Discord button */}
                <button
                  type="button"
                  onClick={handleOpenDiscord}
                  className="flex-1 h-10 flex items-center justify-center gap-2 rounded-sm mc-pixel text-xs transition-all"
                  style={{
                    background: "oklch(0.44 0.25 265 / 0.2)",
                    border: "1.5px solid oklch(0.44 0.25 265 / 0.55)",
                    color: "oklch(0.75 0.22 265)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "oklch(0.44 0.25 265 / 0.35)";
                    e.currentTarget.style.borderColor =
                      "oklch(0.55 0.25 265 / 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "oklch(0.44 0.25 265 / 0.2)";
                    e.currentTarget.style.borderColor =
                      "oklch(0.44 0.25 265 / 0.55)";
                  }}
                >
                  <DiscordIcon className="w-3.5 h-3.5" />
                  <span>OPEN DISCORD</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </button>
              </div>

              {/* Bottom hint */}
              <div
                className="px-5 pb-4 text-center"
                style={{
                  borderTop: "1px solid oklch(0.18 0.01 260)",
                  paddingTop: "12px",
                }}
              >
                <p
                  className="text-xs"
                  style={{
                    color: "oklch(0.38 0.01 260)",
                    fontFamily: "monospace",
                  }}
                >
                  Copy the message → Open Discord → Paste in{" "}
                  <span style={{ color: "oklch(0.55 0.2 265)" }}>#tickets</span>{" "}
                  → Staff will process your order.
                </p>
              </div>
            </dialog>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
