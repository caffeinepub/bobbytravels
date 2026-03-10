import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FlightEnquiryInput,
  PNREnquiryInput,
  TourEnquiryInput,
  UserProfile,
  VisaEnquiryInput,
} from "../backend.d";
import { useActor } from "./useActor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = Record<string, any>;

export function useGetMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const a = actor as unknown as AnyActor;
      if (typeof a.getCallerUserProfile === "function") {
        return a.getCallerUserProfile() as Promise<UserProfile | null>;
      }
      return null;
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
      return a.saveCallerUserProfile(p) as Promise<void>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export const useGetCallerUserProfile = useGetMyProfile;
export const useSaveCallerUserProfile = useSaveMyProfile;

export function useIsAdmin() {
  return useQuery<boolean>({
    queryKey: ["isAdmin_local"],
    queryFn: async () => false,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useIsCallerAdmin() {
  return useIsAdmin();
}

// ── Registration/Login ──────────────────────────────────────────────────────

export function useRegisterUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      email,
      passwordHash,
      name,
      phone,
    }: {
      email: string;
      passwordHash: string;
      name: string;
      phone: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.registerUser(
        email,
        passwordHash,
        name,
        phone,
      ) as Promise<string>;
    },
  });
}

export function useLoginUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      email,
      passwordHash,
    }: {
      email: string;
      passwordHash: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.loginUser(email, passwordHash) as Promise<string>;
    },
  });
}

export function useValidateSession(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["session", token],
    queryFn: async () => {
      if (!actor || !token) return null;
      const a = actor as unknown as AnyActor;
      return a.validateSession(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

// ── Enquiries ────────────────────────────────────────────────────────────────

export function useSubmitFlightEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: FlightEnquiryInput) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.submitFlightEnquiry(input) as Promise<bigint>;
    },
  });
}

export function useSubmitVisaEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: VisaEnquiryInput) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.submitVisaEnquiry(input) as Promise<bigint>;
    },
  });
}

export function useSubmitTourEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: TourEnquiryInput) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.submitTourEnquiry(input) as Promise<bigint>;
    },
  });
}

export function useSubmitPNREnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: PNREnquiryInput) => {
      if (!actor) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.submitPNREnquiry(input) as Promise<bigint>;
    },
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useGetAllFlightEnquiries(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allFlightEnquiries", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const a = actor as unknown as AnyActor;
      return a.getAllFlightEnquiries(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useGetAllVisaEnquiries(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allVisaEnquiries", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const a = actor as unknown as AnyActor;
      return a.getAllVisaEnquiries(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useGetAllTourEnquiries(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allTourEnquiries", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const a = actor as unknown as AnyActor;
      return a.getAllTourEnquiries(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useGetAllPNREnquiries(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allPNREnquiries", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const a = actor as unknown as AnyActor;
      return a.getAllPNREnquiries(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useGetAllUsers(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUsers", token],
    queryFn: async () => {
      if (!actor || !token) return [];
      const a = actor as unknown as AnyActor;
      return a.getAllUsers(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useGetAdminStats(token: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["adminStats", token],
    queryFn: async () => {
      if (!actor || !token) return null;
      const a = actor as unknown as AnyActor;
      return a.getAdminStats(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

export function useUpdateFlightEnquiryStatus(token: string | null) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor || !token) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.updateFlightEnquiryStatus(token, id, status) as Promise<void>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allFlightEnquiries"] });
    },
  });
}

export function useUpdateVisaEnquiryStatus(token: string | null) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor || !token) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.updateVisaEnquiryStatus(token, id, status) as Promise<void>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allVisaEnquiries"] });
    },
  });
}

export function useUpdateTourEnquiryStatus(token: string | null) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor || !token) throw new Error("Not connected");
      const a = actor as unknown as AnyActor;
      return a.updateTourEnquiryStatus(token, id, status) as Promise<void>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allTourEnquiries"] });
    },
  });
}

// Legacy aliases
export function useGetAllEnquiries() {
  return useGetAllFlightEnquiries(null);
}
export function useSubmitEnquiry() {
  return useSubmitFlightEnquiry();
}
export function useUpdateEnquiryStatus() {
  return useUpdateFlightEnquiryStatus(null);
}
