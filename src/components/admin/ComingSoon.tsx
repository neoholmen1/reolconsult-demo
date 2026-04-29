export default function ComingSoon({
  title,
  phase,
  description,
}: {
  title: string;
  phase: string;
  description?: string;
}) {
  return (
    <>
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white px-6">
        <h1 className="text-base font-semibold text-[#171717]">{title}</h1>
        <span className="rounded-full bg-[#e5e5e5] px-3 py-1 text-[11px] font-medium text-[#737373]">
          Kommer
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fafafa] text-[#a3a3a3]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="mt-5 text-xl font-semibold text-[#171717]">
            {title} kommer i {phase}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#737373]">
            {description ??
              "Denne fanen er ikke bygget ennå. Du kan fortsatt bruke Bilder og Innstillinger nå."}
          </p>
        </div>
      </div>
    </>
  );
}
