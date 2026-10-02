# Testing and Validation Report

## Test Plan & Matrix

| Test Case ID | Test Scenario | Impersonated User / Role | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Standard user views non-confidential record | `test.user` (`u_acl_custom_user`) | Access Granted (Record visible) | Pass |
| **TC-02** | Standard user attempts viewing confidential record not assigned | `test.user` (`u_acl_custom_user`) | Access Denied (Row security prevents view) | Pass |
| **TC-03** | Assigned owner views own confidential record | `assigned.worker` (`u_acl_custom_user`) | Access Granted | Pass |
| **TC-04** | Reviewer/Admin views confidential record | `security.reviewer` (`u_acl_reviewer`) | Access Granted | Pass |
| **TC-05** | Standard user attempts editing closed record | `assigned.worker` (`u_acl_custom_user`) | Access Denied (Read-only) | Pass |
| **TC-06** | System Administrator modifies closed record | `admin` (`admin`) | Access Granted | Pass |
| **TC-07** | Non-admin user attempts record deletion | `test.user` (`u_acl_custom_user`) | Delete button hidden / Denied | Pass |
| **TC-08** | Admin deletes non-locked record | `admin` (`admin`) | Access Granted | Pass |

## Verification Summary
All security rules evaluated successfully in the target ServiceNow instance:
- **Read Rule:** Dynamically respects `u_confidential` flag and ownership.
- **Write Rule:** Enforces state-based immutability.
- **Delete Rule:** Protects records from unauthorized removal.
