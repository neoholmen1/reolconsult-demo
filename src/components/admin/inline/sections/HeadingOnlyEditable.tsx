"use client";

import EditableText from "../EditableText";
import { sectionKey } from "../save";

/**
 * Kun en overskrift — brukes til "Nøkkelfakta-overskrift", "Fordeler-overskrift",
 * "Cases-overskrift", "Logo-overskrift".
 */
export default function HeadingOnlyEditable({
  sectionId,
  fieldKey = "title",
  fallback,
  bgClass = "bg-white",
}: {
  sectionId: string;
  fieldKey?: string;
  fallback: string;
  bgClass?: string;
}) {
  return (
    <section className={`${bgClass} pt-10 pb-6 sm:pt-12 sm:pb-8`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EditableText
          fieldKey={sectionKey(sectionId, fieldKey)}
          fallback={fallback}
          as="h2"
          className="text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl"
          style={{ lineHeight: 1.15 }}
        />
      </div>
    </section>
  );
}
