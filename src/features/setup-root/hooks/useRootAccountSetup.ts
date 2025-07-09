import { useMutation, useQuery } from "@tanstack/react-query";
import { rootAccountApi } from "../api/rootAccountApi";
import { useSetupStore } from "@/shared/store/setupStore";

export const useRootAccountSetup = () => {
  const { setRootAccountExists, setLoading, setError } = useSetupStore();

  const statusQuery = useQuery({
    queryKey: ["root-account", "status"],
    queryFn: rootAccountApi.checkStatus,
    onSuccess: (data) => {
      setRootAccountExists(data.exists);
    },
    onError: (error) => {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to check root account status"
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: rootAccountApi.createRootAccount,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setRootAccountExists(true);
      setLoading(false);

      // PEM 파일 다운로드
      const blob = new Blob([data.pemFile], { type: "application/x-pem-file" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sentinel-root-${data.user.username}.pem`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      setError(
        error instanceof Error ? error.message : "Failed to create root account"
      );
      setLoading(false);
    },
  });

  return {
    status: statusQuery.data,
    isCheckingStatus: statusQuery.isLoading,
    createRootAccount: createMutation.mutate,
    isCreating: createMutation.isPending,
    error: statusQuery.error || createMutation.error,
    refetchStatus: statusQuery.refetch,
  };
};
