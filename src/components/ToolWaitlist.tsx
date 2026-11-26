"use client";

import { useRef, type ReactNode } from "react";
import { InterestForm } from "@/components/InterestForm";

/* A free tool that is not built yet: its tile opens a short form, and the
   sign-up lands in the app's Leads list as plan "<tool> waitlist (exam)",
   source tool-<key>, so the team can message everyone the day it is live. */
export function ToolWaitlist({ tool, className, children }: { tool: { key: string; name: string }; className: string; children: ReactNode }) {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className={className} onClick={() => dlg.current?.showModal()} aria-haspopup="dialog">
        {children}
      </button>
      <dialog
        ref={dlg}
        className="tw-dlg"
        aria-label={`${tool.name}: get told when it is live`}
        onClick={(e) => { if (e.target === e.currentTarget) dlg.current?.close(); }}
      >
        <div className="tw-in">
          <button type="button" className="tw-x" onClick={() => dlg.current?.close()} aria-label="Close">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
          <InterestForm
            exam="pick"
            plan={`${tool.name} waitlist`}
            source={`tool-${tool.key}`}
            title={`${tool.name} is coming`}
            sub="Leave your number. We’ll WhatsApp you the day it’s live."
            submit="Notify me"
            done="You’ll be the first to try it."
            choice={{ label: "Exam", options: ["UCEED", "NID", "NIFT"] }}
          />
        </div>
      </dialog>
    </>
  );
}
