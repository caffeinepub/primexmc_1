# PrimeXmc

## Current State
- Login page with Minecraft Username field
- Store page with two sections: RANK (7 tiers) and CRATES (5 keys)
- Buy buttons submit orders to the backend
- Success toast shown after purchase

## Requested Changes (Diff)

### Add
- "Open Discord Ticket" button / flow on each item card: after clicking buy, the user is shown a Discord ticket prompt with a pre-filled message they can copy, and a button that opens the PrimeXmc Discord server (or Discord ticket channel) so they can paste and submit their purchase request there
- A Discord ticket modal/overlay: shows the item name, price, quantity (for crates), username, and a copyable message template like "I want to buy [ITEM] for [USERNAME] - $[PRICE]"
- A Discord icon/button in the store header linking to the Discord server

### Modify
- BUY NOW buttons on rank and crate cards: change behavior to open a Discord ticket modal instead of (or alongside) submitting to backend
- The modal shows: item details, pre-filled ticket message, a "Copy Message" button, and an "Open Discord" button

### Remove
- Nothing removed

## Implementation Plan
1. Create a DiscordTicketModal component that accepts item details (name, type, price, qty, username) and shows a copyable ticket message
2. Update RankCard: clicking BUY NOW opens the Discord ticket modal (keep backend submit as well for order tracking)
3. Update CrateCard: same as above
4. Add Discord server link constant (placeholder URL, user can update)
5. Add a small Discord icon/link in the store header
