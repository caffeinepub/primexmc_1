import {
  Crown,
  Diamond,
  ExternalLink,
  Flame,
  Loader2,
  LogOut,
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Star,
  Sword,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Crate, Rank } from "../backend.d";
import DiscordTicketModal, {
  type TicketItem,
} from "../components/DiscordTicketModal";
import { useCrates, useRanks, useSubmitOrder } from "../hooks/useQueries";

interface StorePageProps {
  username: string;
  onLogout: () => void;
}

type Section = "rank" | "crates";

// Rank tier colors and icons
const RANK_META: Record<
  string,
  { color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  VERTEX: { color: "oklch(0.62 0.2 152)", icon: Zap },
  VETERAN: { color: "oklch(0.68 0.18 160)", icon: Shield },
  MONARCH: { color: "oklch(0.72 0.15 200)", icon: Crown },
  ACE: { color: "oklch(0.78 0.16 80)", icon: Star },
  DEADLIEST: { color: "oklch(0.65 0.22 25)", icon: Flame },
  CAPITAN: { color: "oklch(0.72 0.2 290)", icon: Sword },
  SUPREME: { color: "oklch(0.78 0.16 80)", icon: Diamond },
};

function getRankMeta(name: string) {
  return RANK_META[name] ?? { color: "oklch(0.62 0.2 152)", icon: Trophy };
}

interface RankCardProps {
  rank: Rank;
  username: string;
  index: number;
  onOpenTicket: (item: TicketItem) => void;
}

function RankCard({ rank, username, index, onOpenTicket }: RankCardProps) {
  const { mutate: submitOrder, isPending } = useSubmitOrder();
  const meta = getRankMeta(rank.name);
  const Icon = meta.icon;

  const handleBuy = () => {
    submitOrder(
      {
        username,
        itemName: rank.name,
        itemTypeText: "rank",
        price: rank.price,
        quantity: 1n,
      },
      {
        onSuccess: () => {
          toast.success(`Order placed! ${rank.name} rank purchased.`, {
            icon: "🎖️",
          });
          onOpenTicket({
            name: rank.name,
            type: "Rank",
            price: rank.price,
          });
        },
        onError: () => {
          toast.error("Failed to place order. Please try again.");
        },
      },
    );
  };

  return (
    <motion.div
      className="mc-card rounded-sm p-5 flex flex-col gap-4 relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glow background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${meta.color}18 0%, transparent 70%)`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: meta.color }}
      />

      {/* Rank info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-sm"
            style={{
              background: `${meta.color}22`,
              border: `2px solid ${meta.color}55`,
              color: meta.color,
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div
              className="mc-pixel text-sm font-bold"
              style={{ color: meta.color }}
            >
              {rank.name}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.45 0.01 260)", fontFamily: "monospace" }}
            >
              SERVER RANK
            </div>
          </div>
        </div>

        {/* Price badge */}
        <div
          className="mc-pixel text-sm font-bold px-2 py-1 rounded-sm"
          style={{
            background: "oklch(0.1 0.012 280)",
            border: "2px solid oklch(0.78 0.16 80 / 0.5)",
            color: "oklch(0.78 0.16 80)",
          }}
        >
          ${rank.price.toFixed(2)}
        </div>
      </div>

      {/* Buy button */}
      <button
        type="button"
        className="mc-btn mc-pixel text-xs h-10 w-full flex items-center justify-center gap-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "oklch(0.62 0.2 152)",
          color: "oklch(0.08 0.005 260)",
          cursor: isPending ? "not-allowed" : "pointer",
        }}
        onClick={handleBuy}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>ORDERING...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3 h-3" />
            <span>BUY NOW</span>
          </>
        )}
      </button>
    </motion.div>
  );
}

interface CrateCardProps {
  crate: Crate;
  username: string;
  index: number;
  onOpenTicket: (item: TicketItem) => void;
}

const CRATE_COLORS: string[] = [
  "oklch(0.72 0.15 200)",
  "oklch(0.78 0.16 80)",
  "oklch(0.65 0.22 25)",
  "oklch(0.72 0.2 290)",
  "oklch(0.62 0.2 152)",
];

function CrateCard({ crate, username, index, onOpenTicket }: CrateCardProps) {
  const [qty, setQty] = useState(1);
  const { mutate: submitOrder, isPending } = useSubmitOrder();
  const color = CRATE_COLORS[index % CRATE_COLORS.length];

  const handleBuy = () => {
    submitOrder(
      {
        username,
        itemName: crate.name,
        itemTypeText: "crate",
        price: crate.price,
        quantity: BigInt(qty),
      },
      {
        onSuccess: () => {
          toast.success(`Order placed! ${qty}x ${crate.name} purchased.`, {
            icon: "📦",
          });
          onOpenTicket({
            name: crate.name,
            type: "Crate Key",
            price: crate.price,
            quantity: qty,
          });
        },
        onError: () => {
          toast.error("Failed to place order. Please try again.");
        },
      },
    );
  };

  const totalPrice = (crate.price * qty).toFixed(2);

  return (
    <motion.div
      className="mc-card rounded-sm p-5 flex flex-col gap-4 relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color}18 0%, transparent 70%)`,
        }}
      />

      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: color }}
      />

      {/* Crate info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-sm"
            style={{
              background: `${color}22`,
              border: `2px solid ${color}55`,
            }}
          >
            <Package
              className="w-5 h-5"
              style={{ color } as React.CSSProperties}
            />
          </div>
          <div>
            <div
              className="mc-pixel text-xs font-bold leading-tight"
              style={{ color }}
            >
              {crate.name}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.45 0.01 260)", fontFamily: "monospace" }}
            >
              ${crate.price.toFixed(2)} / {crate.unit}
            </div>
          </div>
        </div>

        {/* Total price */}
        <div
          className="mc-pixel text-sm font-bold px-2 py-1 rounded-sm"
          style={{
            background: "oklch(0.1 0.012 280)",
            border: "2px solid oklch(0.78 0.16 80 / 0.5)",
            color: "oklch(0.78 0.16 80)",
          }}
        >
          ${totalPrice}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-2">
        <span
          className="mc-pixel text-xs"
          style={{ color: "oklch(0.55 0.01 260)" }}
        >
          QTY:
        </span>
        <div
          className="flex items-center rounded-sm overflow-hidden"
          style={{
            border: "2px solid oklch(0.28 0.015 260)",
            background: "oklch(0.1 0.012 280)",
          }}
        >
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ color: "oklch(0.62 0.2 152)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "oklch(0.62 0.2 152 / 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            onClick={() => setQty((p) => Math.max(1, p - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span
            className="mc-pixel text-xs w-10 text-center"
            style={{ color: "oklch(0.92 0.01 100)" }}
          >
            {qty}
          </span>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ color: "oklch(0.62 0.2 152)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "oklch(0.62 0.2 152 / 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            onClick={() => setQty((p) => Math.min(64, p + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <span
          className="text-xs"
          style={{ color: "oklch(0.4 0.01 260)", fontFamily: "monospace" }}
        >
          max 64
        </span>
      </div>

      {/* Buy button */}
      <button
        type="button"
        className="mc-btn mc-pixel text-xs h-10 w-full flex items-center justify-center gap-2 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "oklch(0.62 0.2 152)",
          color: "oklch(0.08 0.005 260)",
          cursor: isPending ? "not-allowed" : "pointer",
        }}
        onClick={handleBuy}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>ORDERING...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3 h-3" />
            <span>BUY {qty > 1 ? `x${qty}` : "NOW"}</span>
          </>
        )}
      </button>
    </motion.div>
  );
}

// Discord icon SVG inline (avoids react-icons dependency)
function DiscordHeaderIcon({ className }: { className?: string }) {
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

export default function StorePage({ username, onLogout }: StorePageProps) {
  const [section, setSection] = useState<Section>("rank");
  const [ticketModal, setTicketModal] = useState<{
    open: boolean;
    item: TicketItem | null;
  }>({ open: false, item: null });
  const { data: ranks, isLoading: ranksLoading } = useRanks();
  const { data: crates, isLoading: cratesLoading } = useCrates();

  const openTicket = (item: TicketItem) => {
    setTicketModal({ open: true, item });
  };

  const closeTicket = () => {
    setTicketModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.1 0.012 280 / 0.95)",
          borderColor: "oklch(0.28 0.015 260)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/primexmc-logo-transparent.dim_400x120.png"
              alt="PrimeXmc"
              className="h-9 w-auto"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm"
              style={{
                background: "oklch(0.16 0.01 260)",
                border: "1px solid oklch(0.28 0.015 260)",
              }}
            >
              <div
                className="w-5 h-5 rounded-sm flex items-center justify-center"
                style={{ background: "oklch(0.62 0.2 152 / 0.2)" }}
              >
                <span style={{ fontSize: "10px" }}>⛏</span>
              </div>
              <span
                className="mc-pixel text-xs"
                style={{ color: "oklch(0.62 0.2 152)" }}
              >
                {username}
              </span>
            </div>

            {/* Discord button */}
            <a
              href="https://discord.gg/primexmc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors"
              style={{
                background: "oklch(0.44 0.25 265 / 0.15)",
                border: "1px solid oklch(0.44 0.25 265 / 0.4)",
                color: "oklch(0.75 0.22 265)",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "oklch(0.44 0.25 265 / 0.28)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "oklch(0.44 0.25 265 / 0.15)";
              }}
              aria-label="Join our Discord"
              title="Join Discord"
            >
              <DiscordHeaderIcon className="w-3.5 h-3.5" />
              <span className="mc-pixel text-xs hidden sm:block">DISCORD</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors"
              style={{
                background: "oklch(0.65 0.22 25 / 0.15)",
                border: "1px solid oklch(0.65 0.22 25 / 0.4)",
                color: "oklch(0.65 0.22 25)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "oklch(0.65 0.22 25 / 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "oklch(0.65 0.22 25 / 0.15)";
              }}
              aria-label="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="mc-pixel text-xs hidden sm:block">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        {/* Welcome banner */}
        <motion.div
          className="mb-8 p-5 rounded-sm relative overflow-hidden"
          style={{
            background: "oklch(0.16 0.01 260)",
            border: "2px solid oklch(0.28 0.015 260)",
            boxShadow:
              "inset 2px 2px 0 oklch(1 0 0 / 0.04), 0 4px 20px oklch(0 0 0 / 0.3)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 0% 50%, oklch(0.62 0.2 152 / 0.07) 0%, transparent 60%)",
            }}
          />
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "24px" }}>⚔️</span>
            <div>
              <div
                className="mc-pixel text-xs mb-0.5"
                style={{ color: "oklch(0.55 0.01 260)" }}
              >
                LOGGED IN AS
              </div>
              <div
                className="mc-pixel text-lg"
                style={{ color: "oklch(0.92 0.01 100)" }}
              >
                Welcome,{" "}
                <span style={{ color: "oklch(0.62 0.2 152)" }}>{username}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section selector */}
        <div className="mb-6 flex gap-2">
          {(["rank", "crates"] as Section[]).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSection(s)}
              className="relative px-6 py-2.5 rounded-sm mc-pixel text-xs transition-all"
              style={{
                background:
                  section === s
                    ? "oklch(0.62 0.2 152)"
                    : "oklch(0.16 0.01 260)",
                color:
                  section === s
                    ? "oklch(0.08 0.005 260)"
                    : "oklch(0.55 0.01 260)",
                border:
                  section === s
                    ? "2px solid oklch(0.72 0.22 152)"
                    : "2px solid oklch(0.28 0.015 260)",
                boxShadow:
                  section === s
                    ? "0 4px 0 oklch(0.3 0.1 152), 0 0 16px oklch(0.62 0.2 152 / 0.3)"
                    : "0 2px 0 oklch(0.1 0 0)",
                cursor: "pointer",
                transform: section === s ? "translateY(-2px)" : "none",
              }}
            >
              {s === "rank" ? (
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3 h-3" />
                  RANK
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Package className="w-3 h-3" />
                  CRATES
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Section heading */}
        <motion.div
          key={section}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center gap-3"
        >
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: "oklch(0.62 0.2 152)",
              boxShadow: "0 0 10px oklch(0.62 0.2 152 / 0.5)",
            }}
          />
          <div>
            <h2
              className="mc-pixel text-base"
              style={{ color: "oklch(0.92 0.01 100)" }}
            >
              {section === "rank" ? "SERVER RANKS" : "CRATE KEYS"}
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.45 0.01 260)", fontFamily: "monospace" }}
            >
              {section === "rank"
                ? "Unlock exclusive perks and privileges"
                : "Open crates to get rare items"}
            </p>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {section === "rank" && (
            <motion.div
              key="rank"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {ranksLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(
                    ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7"] as const
                  ).map((id) => (
                    <div
                      key={id}
                      className="h-40 rounded-sm animate-pulse"
                      style={{ background: "oklch(0.16 0.01 260)" }}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(ranks ?? []).map((rank, i) => (
                    <RankCard
                      key={rank.name}
                      rank={rank}
                      username={username}
                      index={i}
                      onOpenTicket={openTicket}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {section === "crates" && (
            <motion.div
              key="crates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {cratesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(["ck1", "ck2", "ck3", "ck4", "ck5"] as const).map((id) => (
                    <div
                      key={id}
                      className="h-52 rounded-sm animate-pulse"
                      style={{ background: "oklch(0.16 0.01 260)" }}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(crates ?? []).map((crate, i) => (
                    <CrateCard
                      key={crate.name}
                      crate={crate}
                      username={username}
                      index={i}
                      onOpenTicket={openTicket}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Discord Ticket Modal */}
      <DiscordTicketModal
        open={ticketModal.open}
        onClose={closeTicket}
        username={username}
        item={ticketModal.item}
      />

      {/* Footer */}
      <footer
        className="border-t mt-12 py-6 text-center"
        style={{ borderColor: "oklch(0.22 0.01 260)" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className="h-px w-12"
            style={{ background: "oklch(0.28 0.015 260)" }}
          />
          <span style={{ fontSize: "12px" }}>⛏️</span>
          <div
            className="h-px w-12"
            style={{ background: "oklch(0.28 0.015 260)" }}
          />
        </div>
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
      </footer>
    </div>
  );
}
