"""
Pydantic models for request/response validation.

Each extracted field contains a value and evidence snippet for explainability.
"""

from typing import Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Evidence-based extraction field wrappers
# ---------------------------------------------------------------------------

class StringField(BaseModel):
    """A string extraction with supporting evidence."""
    value: Optional[str] = Field(None, description="Extracted string value, or null if not mentioned")
    evidence: Optional[str] = Field(None, description="Exact transcript snippet supporting this extraction")


class IntField(BaseModel):
    """An integer extraction with supporting evidence."""
    value: Optional[int] = Field(None, description="Extracted integer value, or null if not mentioned")
    evidence: Optional[str] = Field(None, description="Exact transcript snippet supporting this extraction")


class FloatField(BaseModel):
    """A float extraction with supporting evidence."""
    value: Optional[float] = Field(None, description="Extracted numeric value, or null if not mentioned")
    evidence: Optional[str] = Field(None, description="Exact transcript snippet supporting this extraction")


class BoolField(BaseModel):
    """A boolean extraction with supporting evidence."""
    value: Optional[bool] = Field(None, description="Extracted boolean value, or null if not mentioned")
    evidence: Optional[str] = Field(None, description="Exact transcript snippet supporting this extraction")


# ---------------------------------------------------------------------------
# Gemini extraction response schema
# ---------------------------------------------------------------------------

class ExtractionData(BaseModel):
    """
    Structured extraction result returned by Gemini.

    Every field is an object with 'value' and 'evidence'.
    Gemini must return null for value and evidence when information is absent.
    """

    # Personal Information
    name: StringField = Field(default_factory=StringField, description="Full name of the loan applicant")
    current_income: FloatField = Field(default_factory=FloatField, description="Current monthly income in rupees")
    type_of_employment: StringField = Field(default_factory=StringField, description="Employment category (e.g. farmer, labourer, shopkeeper)")

    # Family Information
    family_members: IntField = Field(default_factory=IntField, description="Total number of family members")
    members_above_18: IntField = Field(default_factory=IntField, description="Number of adults (age 18+) in household")
    members_employed: IntField = Field(default_factory=IntField, description="Number of working/earning members")
    children_count: IntField = Field(default_factory=IntField, description="Number of children in the family")

    # Education
    school_type: StringField = Field(default_factory=StringField, description="Type of school children attend: Government or Private")

    # Business Information
    side_business: BoolField = Field(default_factory=BoolField, description="Whether the applicant has a side business")
    business_type: StringField = Field(default_factory=StringField, description="Type of side business if any")

    # Housing Information
    owns_house: BoolField = Field(default_factory=BoolField, description="Whether the applicant owns their house")
    house_type: StringField = Field(default_factory=StringField, description="House type: Pucca, Semi-Pucca, or Kaccha")

    # Loan Information
    existing_loans: BoolField = Field(default_factory=BoolField, description="Whether the applicant has active loans")
    monthly_emi: FloatField = Field(default_factory=FloatField, description="Current monthly EMI amount in rupees")

    # Agriculture Information
    farm_animals: IntField = Field(default_factory=IntField, description="Number of farm animals owned")
    farm_land: StringField = Field(default_factory=StringField, description="Amount of agricultural land (e.g. '2 bigha', '1 acre')")
    income_from_land: FloatField = Field(default_factory=FloatField, description="Monthly or annual income from agricultural land in rupees")

    # Household Information
    cooking_fuel: StringField = Field(default_factory=StringField, description="Primary cooking fuel: LPG, Wood, Biomass, Cow Dung, etc.")
    one_time_expense: StringField = Field(default_factory=StringField, description="Any major one-time household expense mentioned")

    # Transcript
    transcript: str = Field(..., description="Complete verbatim transcript of the entire audio conversation")


# ---------------------------------------------------------------------------
# API response models
# ---------------------------------------------------------------------------

class ProcessingResponse(BaseModel):
    """Successful API response containing extraction results."""
    status: str = "success"
    data: ExtractionData
    raw_response: str = Field("", description="Raw JSON string returned by Gemini")
    model_used: str = Field("", description="The Gemini model that successfully processed the request")


class ErrorResponse(BaseModel):
    """Error API response."""
    status: str = "error"
    message: str
    detail: Optional[str] = None
