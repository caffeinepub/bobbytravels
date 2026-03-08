import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TripType, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export function useSubmitEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      origin: string;
      destination: string;
      departureDate: string;
      returnDate: string | null;
      tripType: TripType;
      passengerCount: bigint;
      specialRequests: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitEnquiry(
        params.origin,
        params.destination,
        params.departureDate,
        params.returnDate,
        params.tripType,
        params.passengerCount,
        params.specialRequests,
      );
    },
  });
}
