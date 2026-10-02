# Testing Guide & Verification Matrix

## Execution & Test Evidence

| Test ID | Operation | User / Role | Field Condition | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ACL-01** | `read` | `test.user` (`u_acl_custom_user`) | `u_confidential = false` | Record visible | Visible | **PASS** |
| **ACL-02** | `read` | `test.user` (`u_acl_custom_user`) | `u_confidential = true` (not assigned) | Record hidden / access denied | Hidden | **PASS** |
| **ACL-03** | `read` | `assigned.worker` (`u_acl_custom_user`) | `u_confidential = true` (assigned) | Record visible | Visible | **PASS** |
| **ACL-04** | `read` | `audit.reviewer` (`u_acl_reviewer`) | `u_confidential = true` | Record visible | Visible | **PASS** |
| **ACL-05** | `write` | `assigned.worker` (`u_acl_custom_user`) | `u_status = 'Work in Progress'` | Form editable & savable | Saved | **PASS** |
| **ACL-06** | `write` | `assigned.worker` (`u_acl_custom_user`) | `u_status = 'Closed'` | Form read-only | Read-only | **PASS** |
| **ACL-07** | `create` | `test.user` (`u_acl_custom_user`) | Standard insert | New record form accessible | Form Opens | **PASS** |
| **ACL-08** | `delete` | `test.user` (`u_acl_custom_user`) | Any record | Delete action hidden | Action Hidden | **PASS** |
| **ACL-09** | `delete` | `admin` (`security_admin`) | Active non-locked record | Delete action permitted | Deleted | **PASS** |

## Verification Procedures
1. Use **System Administrator > Impersonate User** to validate permissions across roles.
2. Confirm that access control debugging (`System Diagnostics > Session Debug > Enable ACL Debug`) logs matching rule evaluation decisions.
