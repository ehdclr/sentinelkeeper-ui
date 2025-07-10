import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { rootAccountApi } from "../api/rootAccountApi";
import { useSetupStore } from "@/shared/store/setupStore";



export const useRootAccountSetup = () => {
  const { setRootAccountStatus, setLoading, setError } = useSetupStore();
  // 루트 계정 생성
  const createMutation = useMutation({
    mutationFn: createRootAccount,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      console.log("Root account created successfully:", data);

      // 상태 업데이트
      setRootAccountStatus({ exists: true });
      setLoading(false);

      // PEM 파일 다운로드
      if (data.pemFile) {
        try {
          const blob = new Blob([data.pemFile], {
            type: "application/x-pem-file",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sentinel-root-${data.user?.username || "admin"}.pem`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (downloadError) {
          console.error("Failed to download PEM file:", downloadError);
        }
      }

      // 상태 쿼리 다시 가져오기
      statusQuery.refetch();
    },
    onError: (error) => {
      console.error("Failed to create root account:", error);
      setLoading(false);
      setError(error);
    },
  });

  // 상태 쿼리 결과를 store에 반영
  useEffect(() => {
    if (statusQuery.data) {
      setRootAccountStatus(statusQuery.data);
    }
  }, [statusQuery.data, setRootAccountStatus]);

  // 에러 상태를 store에 반영
  useEffect(() => {
    const error = statusQuery.error || createMutation.error;
    if (error) {
      setError(error);
    }
  }, [statusQuery.error, createMutation.error, setError]);

  return {
    // 상태 데이터
    status: statusQuery.data,
    isCheckingStatus: statusQuery.isLoading,

    // 생성 관련
    createRootAccount: createMutation.mutate,
    isCreating: createMutation.isPending,

    // 에러 및 기타
    error: statusQuery.error || createMutation.error,
    isError: statusQuery.isError || createMutation.isError,

    // 액션
    refetchStatus: statusQuery.refetch,
    reset: () => {
      createMutation.reset();
      setError(null);
    },
  };
};
