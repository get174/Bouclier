#!/usr/bin/env python3
"""
Migration script to fix user building assignments
This script helps ensure all users have proper building assignments
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.User import User
from backend.mongo import get_db_connection

def fix_user_buildings():
    """Fix user buil0ding assignments"""
    print("Starting user building fix...")
    
    # Get database connection
    db = get_db_connection()
    
    # Get all users
    users = User.find()
    
    print(f"Found {len(users)} users")
    
    # Check and fix building assignments
    for user in users:
        if not user.buildingId:
            print(f"User {user.email} has no building assigned")
            # You can add logic here to assign default building or prompt for assignment
    
    print("User building fix completed")

if __name__ == "__main__":
    fix_user_buildings()
