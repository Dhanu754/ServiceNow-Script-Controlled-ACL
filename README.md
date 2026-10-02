# Script-Controlled ACL – Restrict Record Access Based on Field Value

## Project Description
In ServiceNow, Access Control Lists (ACLs) are security rules defined to restrict the access of data and operations (read, write, create, delete) on tables and fields. This project implements Script-Controlled Access Control Lists (ACLs) to dynamically restrict record and field-level access based on specific field values, conditions, and user roles within the ServiceNow platform.

A custom script is evaluated server-side to check specific field values (such as record confidentiality, state, or assigned owner) before granting access. Users can only perform operations when the ACL script condition evaluates to `true`.

## Demo URL
- **Demo / Instance URL:** https://dev445323.service-now.com

## Team Members

### Leader
- **Name:** Dhana lakshmi M
- **Email:** pavithra26152006@gmail.com
- **Role:** Leader

### Member
- **Name:** Harishbharathi M
- **Email:** harishbharathi0861@gmail.com
- **Role:** Member

### Member
- **Name:** Rajgowtham A
- **Email:** priyaatheeswaran@gmail.com
- **Role:** Member

## Major Features
1. **Dynamic Field-Value Access Control**:
   - Implements script-controlled access evaluation using `current.<field_name>` and `gs.getUserID()` / `gs.hasRole()`.
   - Restricts read, write, create, and delete operations dynamically based on field states (e.g., status, sensitivity level, confidentiality flag).
2. **Role & User-Based Permission Layers**:
   - Specific user roles configured to manage different access tiers (`u_acl_custom_user`, `u_acl_reviewer`, `u_acl_admin`).
   - Granular separation of duties between regular users, managers, and administrators.
3. **Comprehensive CRUD Security Enforcement**:
   - **Read ACL**: Only authorized users or record owners can view confidential records.
   - **Create ACL**: Only users with designated roles can create new requests/records.
   - **Write ACL**: Records cannot be modified once they reach terminal states (e.g. 'Closed' / 'Resolved') or if marked confidential without elevated roles.
   - **Delete ACL**: Deletion is strictly restricted to administrative roles and active non-locked records.
4. **Data Integrity & Audit Compliance**:
   - Prevents unauthorized escalation of privileges.
   - Ensures sensitive organizational data meets compliance and security governance.

## Milestones & Implementation Details
- **Milestone 1 - Users and Roles Creation**: Created specialized test users and security roles to represent organizational tiers.
- **Milestone 2 - Table & Schema Architecture**: Designed custom ServiceNow table with tracking fields (`u_number`, `u_short_description`, `u_status`, `u_confidential`, `u_assigned_to`).
- **Milestone 3 - Access Control List (READ)**: Scripted Read ACL validating user assignment and confidentiality flag.
- **Milestone 4 - Access Control List (CREATE)**: Controlled creation rights for catalog and table records.
- **Milestone 5 - Access Control List (WRITE)**: Dynamic script restricting record updates when status is closed or user is unauthorized.
- **Milestone 6 - Access Control List (DELETE)**: High-security Delete ACL requiring admin credentials.
- **Milestone 7 - Verification & Project Conclusion**: End-to-end impersonation testing verifying permission boundaries across all operations.

## Setup and Run Instructions
1. **Login to ServiceNow Instance**:
   - Access the ServiceNow instance at `https://dev445323.service-now.com`.
   - Log in with System Administrator privileges.
2. **Elevate Privileges**:
   - Click the user avatar profile icon in the upper right.
   - Select **Elevate Roles** and activate `security_admin`.
3. **Navigate to Access Controls**:
   - In the All navigation menu, go to **System Security > Access Control (ACL)**.
4. **Review / Import ACL Rules**:
   - Open the table `u_confidential_records` or target custom table.
   - Review the Script-Controlled ACLs for `read`, `write`, `create`, and `delete`.
   - Check the **Advanced** checkbox to inspect the JavaScript evaluation code.
5. **Testing Access Controls**:
   - Use the **Impersonate User** feature to test access under different user personas:
     - As standard user: Verify that confidential records are hidden or read-only.
     - As assigned user: Verify update permissions for active records.
     - As administrator: Verify complete access and maintenance capability.
