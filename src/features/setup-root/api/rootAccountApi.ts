import type {
  RootAccountSetupStatus,
  RootAccountCreateRequest,
  RootAccountCreateResponse,
} from "@/entities/setup/model";

export const rootAccountApi = {
  checkStatus: async (): Promise<RootAccountSetupStatus> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response - 실제로는 API 호출
    return {
      exists: false, // 실제 상태에 따라 변경
      username: undefined,
      createdAt: undefined,
    };
  },

  createRootAccount: async (
    data: RootAccountCreateRequest
  ): Promise<RootAccountCreateResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock PEM file generation
    const pemContent = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB
wjXGxIbfNQ9ywla/7RM0+rFnH8xHXf5vJ0taO4+jjFzo1G+Q8oCv/HuebRDrCD/z
AKskA13jomBz4cvFUsP7srZwo16CcHuJp4Ux5f07yWA+b2Q62XliJjQKxnAiSn1k
9+2SgfnOdBHlicOiAQDXPUspTt4xAbdgqljLfqHuHdMK9B/Fpk0SXNjBT8sVYz7u
IiLaUKVW1jKpE3EY+6SLsyHgl9lL8+hkRxEqEVf1LuD/iLBrBt4AG3LovDJduCWN
jRdcyeVTPOue/34P2l1a2NQnfnlbXRRs2ku7SxSXDNtNsN2v552l+0PKSQXn3KeN
lVzDVBfTAgMBAAECggEBALc2lQACC8cSfh+bzMn3r7DD3CbPyiPBneuVjn7yODkD
XPuWBQ2rnXoZ7T2lBrenbRcBLjmQrKEuQRxmPl3xvgNjZzNpXriLs/FCRjeFJOWu
BoFuAaKyHDNOTVnDECpanmdNXTn4VJbfU5fINjsiLEEBKubp5xQ/ABEBAQI=
-----END PRIVATE KEY-----`;

    return {
      success: true,
      pemFile: pemContent,
      user: {
        id: "root-1",
        username: data.username,
        email: data.email,
      },
    };
  },
};
