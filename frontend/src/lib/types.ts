/**
 * TypeScript type definitions for the LTFS Audio Extraction Platform.
 *
 * Mirrors the Pydantic models in the backend for end-to-end type safety.
 */

// ---------------------------------------------------------------------------
// Evidence-based field types
// ---------------------------------------------------------------------------

export interface StringField {
  value: string | null;
  evidence: string | null;
}

export interface IntField {
  value: number | null;
  evidence: string | null;
}

export interface FloatField {
  value: number | null;
  evidence: string | null;
}

export interface BoolField {
  value: boolean | null;
  evidence: string | null;
}

// ---------------------------------------------------------------------------
// Extraction data — structured output from Gemini
// ---------------------------------------------------------------------------

export interface ExtractionData {
  // Personal Information
  name: StringField;
  current_income: FloatField;
  type_of_employment: StringField;

  // Family Information
  family_members: IntField;
  members_above_18: IntField;
  members_employed: IntField;
  children_count: IntField;

  // Education
  school_type: StringField;

  // Business Information
  side_business: BoolField;
  business_type: StringField;

  // Housing Information
  owns_house: BoolField;
  house_type: StringField;

  // Loan Information
  existing_loans: BoolField;
  monthly_emi: FloatField;

  // Agriculture Information
  farm_animals: IntField;
  farm_land: StringField;
  income_from_land: FloatField;

  // Household Information
  cooking_fuel: StringField;
  one_time_expense: StringField;

  // Transcript
  transcript: string;
}

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------

export interface ProcessingResponse {
  status: "success";
  data: ExtractionData;
  raw_response: string;
  model_used?: string;
}

export interface ErrorResponse {
  status: "error";
  message: string;
  detail?: string;
}

export type ApiResponse = ProcessingResponse | ErrorResponse;

// ---------------------------------------------------------------------------
// Application state
// ---------------------------------------------------------------------------

export type ProcessingState = "idle" | "processing" | "complete" | "error";

export interface AppState {
  processingState: ProcessingState;
  selectedFile: File | null;
  result: ProcessingResponse | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Field display helpers
// ---------------------------------------------------------------------------

export type FieldType = StringField | IntField | FloatField | BoolField;

export interface FieldDisplayConfig {
  label: string;
  key: keyof ExtractionData;
  format?: (value: unknown) => string;
}

import type { ReactNode } from "react";

export interface SectionConfig {
  title: string;
  icon: ReactNode;
  fields: FieldDisplayConfig[];
}
