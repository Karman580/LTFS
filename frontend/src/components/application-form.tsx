"use client";

import React from "react";
import type { ExtractionData, FieldType, SectionConfig } from "@/lib/types";

interface ApplicationFormProps {
  data: ExtractionData;
}

// ---------------------------------------------------------------------------
// Section configuration
// ---------------------------------------------------------------------------

const SECTIONS: SectionConfig[] = [
  {
    title: "Personal Information",
    icon: (
      <svg className="h-5 w-5 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    fields: [
      { label: "Applicant Name", key: "name" },
      {
        label: "Current Monthly Income",
        key: "current_income",
        format: (v) => `₹ ${Number(v).toLocaleString("en-IN")}`,
      },
      { label: "Employment Type", key: "type_of_employment" },
    ],
  },
  {
    title: "Family Information",
    icon: (
      <svg className="h-5 w-5 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    fields: [
      { label: "Total Family Members", key: "family_members" },
      { label: "Members Above 18", key: "members_above_18" },
      { label: "Members Employed", key: "members_employed" },
      { label: "Number of Children", key: "children_count" },
      { label: "School Type", key: "school_type" },
    ],
  },
  {
    title: "Business Information",
    icon: (
      <svg className="h-5 w-5 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
      </svg>
    ),
    fields: [
      {
        label: "Has Side Business",
        key: "side_business",
        format: (v) => (v === true ? "Yes" : v === false ? "No" : String(v)),
      },
      { label: "Business Type", key: "business_type" },
    ],
  },
  {
    title: "Housing Information",
    icon: (
      <svg className="h-5 w-5 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.592 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    fields: [
      {
        label: "Owns House",
        key: "owns_house",
        format: (v) => (v === true ? "Yes" : v === false ? "No" : String(v)),
      },
      { label: "House Type", key: "house_type" },
    ],
  },
  {
    title: "Loan Information",
    icon: (
      <svg className="h-5 w-5 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
      </svg>
    ),
    fields: [
      {
        label: "Existing Loans",
        key: "existing_loans",
        format: (v) => (v === true ? "Yes" : v === false ? "No" : String(v)),
      },
      {
        label: "Monthly EMI",
        key: "monthly_emi",
        format: (v) => `₹ ${Number(v).toLocaleString("en-IN")}`,
      },
    ],
  },
  {
    title: "Agriculture Information",
    icon: (
      <svg className="h-5 w-5 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
    fields: [
      { label: "Farm Animals", key: "farm_animals" },
      { label: "Farm Land", key: "farm_land" },
      {
        label: "Income from Land",
        key: "income_from_land",
        format: (v) => `₹ ${Number(v).toLocaleString("en-IN")}`,
      },
    ],
  },
  {
    title: "Household Information",
    icon: (
      <svg className="h-5 w-5 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.866 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
      </svg>
    ),
    fields: [
      { label: "Cooking Fuel", key: "cooking_fuel" },
      { label: "One-Time Expense", key: "one_time_expense" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Field renderer
// ---------------------------------------------------------------------------

function FieldRow({
  label,
  field,
  format,
}: {
  label: string;
  field: FieldType;
  format?: (value: unknown) => string;
}) {
  const hasValue = field.value !== null && field.value !== undefined;

  let displayValue: string;
  if (hasValue && format) {
    displayValue = format(field.value);
  } else if (hasValue) {
    displayValue = String(field.value);
  } else {
    displayValue = "Not Mentioned";
  }

  return (
    <div className="space-y-1 rounded-lg border border-[#D9D9D9] bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-medium uppercase tracking-wider text-[#666666]">
          {label}
        </span>
        <span
          className={`text-right text-sm font-medium ${
            hasValue ? "text-[#111111]" : "italic text-[#666666]"
          }`}
        >
          {displayValue}
        </span>
      </div>
      {field.evidence && (
        <p className="mt-1 border-l-2 border-[#F5C400] pl-3 text-xs leading-relaxed text-[#666666]">
          &ldquo;{field.evidence}&rdquo;
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ApplicationForm({ data }: ApplicationFormProps) {
  return (
    <section id="application-form" className="space-y-5">
      <div className="flex items-center gap-3">
        <h2 className="text-[#111111] text-xl font-bold border-b-2 border-[#F5C400] pb-2 inline-block">
          Customer Application Summary
        </h2>
        <span className="rounded-full bg-[#16A34A]/20 px-3 py-0.5 text-xs font-medium text-[#16A34A]">
          Application Processed
        </span>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="overflow-hidden rounded-2xl border border-[#D9D9D9] bg-[#FFFFFF] shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
          >
            {/* Section header */}
            <div className="border-b border-[#D9D9D9] bg-[#F5F5F5] px-5 py-3.5">
              <h3 className="flex items-center gap-2.5 text-sm font-bold text-[#111111]">
                <span className="text-base">{section.icon}</span>
                {section.title}
              </h3>
            </div>

            {/* Fields */}
            <div className="space-y-2 p-4">
              {section.fields.map((fieldConfig) => {
                const field = data[fieldConfig.key] as FieldType;
                if (!field || typeof field !== "object") return null;

                return (
                  <FieldRow
                    key={fieldConfig.key}
                    label={fieldConfig.label}
                    field={field}
                    format={fieldConfig.format}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
