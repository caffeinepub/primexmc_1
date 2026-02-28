import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Crate, Rank } from "../backend.d";
import { useActor } from "./useActor";

const FALLBACK_RANKS: Rank[] = [
  { name: "VERTEX", price: 0.4 },
  { name: "VETERAN", price: 0.7 },
  { name: "MONARCH", price: 1.0 },
  { name: "ACE", price: 1.4 },
  { name: "DEADLIEST", price: 1.7 },
  { name: "CAPITAN", price: 2.1 },
  { name: "SUPREME", price: 3.0 },
];

const FALLBACK_CRATES: Crate[] = [
  { name: "KEYALL", unit: "pk", price: 0.1 },
  { name: "PARTY", unit: "pk", price: 0.1 },
  { name: "SPAWNNER", unit: "pk", price: 0.2 },
  { name: "LEGEND", unit: "pk", price: 0.3 },
  { name: "HOLI [MONTHLY CRATE KEY]", unit: "pk", price: 0.5 },
];

export function useRanks() {
  const { actor, isFetching } = useActor();
  return useQuery<Rank[]>({
    queryKey: ["ranks"],
    queryFn: async () => {
      if (!actor) return FALLBACK_RANKS;
      try {
        const result = await actor.getRanks();
        return result.length > 0 ? result : FALLBACK_RANKS;
      } catch {
        return FALLBACK_RANKS;
      }
    },
    enabled: !isFetching,
    placeholderData: FALLBACK_RANKS,
  });
}

export function useCrates() {
  const { actor, isFetching } = useActor();
  return useQuery<Crate[]>({
    queryKey: ["crates"],
    queryFn: async () => {
      if (!actor) return FALLBACK_CRATES;
      try {
        const result = await actor.getCrates();
        return result.length > 0 ? result : FALLBACK_CRATES;
      } catch {
        return FALLBACK_CRATES;
      }
    },
    enabled: !isFetching,
    placeholderData: FALLBACK_CRATES,
  });
}

export function useSubmitOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      itemName,
      itemTypeText,
      price,
      quantity,
    }: {
      username: string;
      itemName: string;
      itemTypeText: string;
      price: number;
      quantity: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitOrder(
        username,
        itemName,
        itemTypeText,
        price,
        quantity,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
