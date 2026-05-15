from datetime import datetime
from database import db
import logging

logger = logging.getLogger("audit_log")

async def log_action(user_id: str, email: str, action: str, module: str, status: str = "success", details: str = None):
    """
    Logs an action to the audit_logs collection and system logs.
    """
    audit_entry = {
        "timestamp": datetime.utcnow(),
        "user_id": user_id,
        "email": email,
        "action": action,
        "module": module,
        "status": status,
        "details": details
    }
    
    try:
        await db.audit_logs.insert_one(audit_entry)
        logger.info(f"AUDIT: {email} | {action} | {module} | {status} | {details}")
    except Exception as e:
        logger.error(f"Failed to save audit log: {e}")
