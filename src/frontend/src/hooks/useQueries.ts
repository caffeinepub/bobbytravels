import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FlightEnquiry,
  FlightEnquiryInput,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Profile ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = Record<string, any>;

export function useGetMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const a = actor as unknown as AnyActor;
      // Try new API first, fall back to old
      if (typeof a.getMyProfile === "function") {
        return a.getMyProfile() as Promise<UserProfile | null>;
      }
      return a.getCallerUserProfile() as Promise<UserProfile | null>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveMyProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (p: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      if (typeof a.saveMyProfile === "function") {
        return a.saveMyProfile(
          p.name,
          p.email,
          p.phone ?? null,
        ) as Promise<void>;
      }
      return a.saveCallerUserProfile(p) as Promise<void>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      void queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

// Keep legacy alias for any remaining callers
export const useGetCallerUserProfile = useGetMyProfile;
export const useSaveCallerUserProfile = useSaveMyProfile;

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      const a = actor as unknown as AnyActor;
      if (typeof a.isAdmin === "function") {
        return a.isAdmin() as Promise<boolean>;
      }
      return a.isCallerAdmin() as Promise<boolean>;
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// Keep legacy alias
export function useIsCallerAdmin() {
  return useIsAdmin();
}

export function useInitializeAccessControl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (secret: string) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.claimAdminAccess(secret) as Promise<void>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      void queryClient.invalidateQueries({ queryKey: ["isCallerAdmin"] });
      void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

// ── Enquiries ────────────────────────────────────────────────────────────────

export function useGetAllEnquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<FlightEnquiry[]>({
    queryKey: ["allEnquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEnquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: FlightEnquiryInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitEnquiry(input);
    },
  });
}

export function useUpdateEnquiryStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      if (typeof a.updateEnquiryStatus === "function") {
        return a.updateEnquiryStatus(id, status) as Promise<void>;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allEnquiries"] });
    },
  });
}
