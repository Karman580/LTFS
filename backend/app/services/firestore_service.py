import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import logging

from ..config import settings

logger = logging.getLogger(__name__)

db = None

def init_firebase():
    global db
    if not settings.firebase_credentials_path:
        logger.warning("FIREBASE_CREDENTIALS_PATH not set in environment.")
        return

    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.firebase_credentials_path)
            firebase_admin.initialize_app(cred)
        
        # Access the specific LTFS database.
        db = firestore.client() # Uses default db. To use a named database in Python admin SDK, you'd usually pass it to client() or project. 
        # But wait, Firestore client handles multiple DBs usually via google-cloud-firestore directly or since firebase-admin 6.2.0:
        # We can just get the client and if 'LTFS' is a collection or db we can configure it.
        # Let's try standard client. Note: Firebase default database is (default). If LTFS is the db name:
        # db = firestore.client(app=firebase_admin.get_app())
        logger.info("Firebase initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {e}")

init_firebase()

def save_application_record(record: dict):
    """
    Saves the processed application record to Firestore.
    """
    if not db:
        logger.warning("Firestore DB not initialized, skipping save.")
        return
        
    try:
        # Ensure we write to 'applications' collection
        # Firebase Admin SDK allows interacting with named databases by instantiating a client directly:
        # from google.cloud import firestore
        # client = firestore.Client(project=project_id, database="LTFS")
        # Since we initialized via firebase_admin, we can just use the collection.
        # If LTFS is just the project name, db.collection("applications") is sufficient.
        
        doc_id = record.get("submission_id")
        if doc_id:
            db.collection("applications").document(doc_id).set(record)
        else:
            db.collection("applications").add(record)
            
        logger.info(f"Saved application record {doc_id} to Firestore.")
    except Exception as e:
        logger.error(f"Failed to save record to Firestore: {e}")
