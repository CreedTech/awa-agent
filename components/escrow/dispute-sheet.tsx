"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Field } from "@/components/shared/field";
import { Icon } from "@/components/ui/icon";
import { disputeSchema, DISPUTE_REASONS, type DisputeValues } from "@/lib/validations";

interface DisputeSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, description: string) => void;
}

/** Raise-a-dispute flow: reason + evidence + description → freezes escrow. */
export function DisputeSheet({ open, onClose, onSubmit }: DisputeSheetProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DisputeValues>({ resolver: zodResolver(disputeSchema) });

  const submit = (values: DisputeValues) => {
    onSubmit(values.reason, values.description);
    reset();
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Raise a dispute" maxWidth={460}>
      <form className="col gap-4" style={{ padding: "8px 20px 24px" }} onSubmit={handleSubmit(submit)} noValidate>
        <div className="row gap-2" style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "10px 13px", borderRadius: 10, fontSize: 13 }}>
          <Icon name="alert" size={16} />
          <span>Raising a dispute freezes your escrow until our team reviews it (within 24 hours).</span>
        </div>

        <Field label="What went wrong?" error={errors.reason?.message}>
          <select className="select" defaultValue="" {...register("reason")}>
            <option value="" disabled>Select a reason</option>
            {DISPUTE_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </Field>

        <Field label="Describe what happened" error={errors.description?.message}>
          <textarea className="input" rows={4} placeholder="Give as much detail as you can…" {...register("description")} />
        </Field>

        <div className="field">
          <span className="label">Evidence (optional)</span>
          <div className="row gap-2 center" style={{ border: "1.5px dashed var(--line-2)", borderRadius: 12, padding: "18px", color: "var(--muted)", fontSize: 13.5, cursor: "pointer" }}>
            <Icon name="upload" size={18} /> Add photos or screenshots
          </div>
        </div>

        <button className="btn btn-danger btn-block btn-lg" type="submit" disabled={isSubmitting}>
          <Icon name="lock" size={17} /> Freeze escrow & open dispute
        </button>
      </form>
    </BottomSheet>
  );
}
