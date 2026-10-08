import { apiFetch } from "@/lib/api";

type UploadKind = "LISTING_PHOTO" | "KYC_DOCUMENT";
type UploadReceipt = { id: string; url: string | null };

export const uploadService = {
  async upload(file: File, kind: UploadKind, requestId?: string): Promise<UploadReceipt> {
    const prepared = await apiFetch<{ data: { id: string; uploadUrl: string; contentType: string } }>("/uploads", {
      method: "POST", json: { kind, contentType: file.type, size: file.size, requestId },
    });
    const response = await fetch(prepared.data.uploadUrl, {
      method: "PUT", headers: { "Content-Type": prepared.data.contentType }, body: file,
    });
    if (!response.ok) throw new Error("Cloudflare R2 rejected the upload. Check the file and try again.");
    const completed = await apiFetch<{ data: UploadReceipt }>(`/uploads/${encodeURIComponent(prepared.data.id)}/complete`, { method: "POST" });
    return completed.data;
  },
  async kycDocuments(requestId: string) {
    const response = await apiFetch<{ data: { id: string; downloadUrl: string; contentType: string }[] }>(`/uploads/admin/kyc/${encodeURIComponent(requestId)}`);
    return response.data;
  },
};
