export const TERMS_AND_CONDITIONS_COPY =
  "The $70 call-out fee covers travel to your location and an initial inspection. The fee applies whether or not you proceed with repairs. Additional charges may apply for further diagnosis, labour, repairs or parts. All additional work will be discussed before proceeding.";

export function TermsConditionsNote({ className = "" }: { className?: string }) {
  return (
    <div className={`terms-conditions-note ${className}`.trim()}>
      <p>
        <strong>Terms &amp; Conditions:</strong> {TERMS_AND_CONDITIONS_COPY}
      </p>
    </div>
  );
}
