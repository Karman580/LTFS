import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import logging

from ..config import settings

logger = logging.getLogger(__name__)

db = None

import json

def get_firestore_client():
    """Initializes and returns the Firestore client."""
    global db
    if db is not None:
        return db

    json_str = settings.firebase_service_account_json
    if not json_str:
        logger.warning("FIREBASE_SERVICE_ACCOUNT_JSON not set in environment.")
        return None

    try:
        if not firebase_admin._apps:
            # Parse the stringified JSON into a dictionary
            cred_dict = json.loads(json_str)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            logger.info("Firestore initialized via JSON environment variable")
        db = firestore.client()
        return db
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
        return None

def save_application_record(record: dict):
    """
    Saves the application tracking record to the 'applications' collection.
    """
    client = get_firestore_client()
    if not client:
        logger.warning("Firestore DB not initialized, skipping save.")
        return
        
    try:
        doc_id = record.get("submission_id")
        logger.info(f"Writing document to Firestore. Document ID: {doc_id}")
        doc_ref = client.collection("applications").document(doc_id)
        doc_ref.set(record)
        logger.info(f"Firestore write successful for Document ID: {doc_id}")
    except Exception as e:
        logger.error(f"Failed to save record to Firestore: {e}")
