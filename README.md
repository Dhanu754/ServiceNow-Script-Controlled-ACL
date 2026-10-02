# ServiceNow Security Governance: Script-Controlled ACL Implementation

[![Platform](https://img.shields.io/badge/Platform-ServiceNow%20PDI-80B434?logo=servicenow&logoColor=white)](https://dev445323.service-now.com)
[![SkillWallet](https://img.shields.io/badge/SkillWallet-100%25%20Completed-brightgreen)](https://myskillwallet.ai)
[![Security](https://img.shields.io/badge/Security-Access%20Control%20List-orange)](https://github.com/Dhanu754/ServiceNow-Script-Controlled-ACL)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade ServiceNow Access Control List (ACL) security customization implementing dynamic, script-evaluated security rules to restrict record and field-level operations based on real-time field values, user roles, and ownership conditions.

---

## Executive Summary

| Attribute | Value |
|---|---|
| **SkillWallet Project** | Script-Controlled ACL – Restrict Record Access Based on Field Value |
| **SkillWallet Project ID** | `6a96be195827789d6375618f` |
| **SkillWallet Subscribed ID** | `6ab4b8486f290be8a6b3e7f1` |
| **ServiceNow Instance (PDI)** | [https://dev445323.service-now.com](https://dev445323.service-now.com) |
| **Target Table** | `u_confidential_records` |
| **Repository URL** | [https://github.com/Dhanu754/ServiceNow-Script-Controlled-ACL](https://github.com/Dhanu754/ServiceNow-Script-Controlled-ACL) |
| **Demo URL** | [https://dev445323.service-now.com](https://dev445323.service-now.com) |
| **Completion Status** | **100% Completed** (All 7 Milestones & 8 Stories Fully Executed) |

---

## Team Members

| Name | Role | Email |
|---|---|---|
| **Dhana lakshmi M** | Leader | pavithra26152006@gmail.com |
| **Harishbharathi M** | Member | harishbharathi0861@gmail.com |
| **Rajgowtham A** | Member | priyaatheeswaran@gmail.com |

---

## Problem Statement & Objective

### Problem Statement
Standard role-based access control (RBAC) in ServiceNow assigns static permissions to roles regardless of data context. In enterprise environments, sensitive records often contain dynamic states (e.g., marked as confidential, belonging to specific departments, or reaching terminal states such as Closed) where access permissions must dynamically shift to prevent unauthorized exposure or post-closure tampering.

### Objective
Implement server-side **Script-Controlled ACLs** that dynamically evaluate field values (`u_confidential`, `u_status`, `u_assigned_to`) in conjunction with user credentials (`gs.getUserID()`, `gs.hasRole()`) to enforce zero-trust security boundaries across `read`, `write`, `create`, and `delete` operations.

---

## Architecture & Security Workflow

```
                                  +------------------------------------+
                                  |    ServiceNow GlideSecurityManager |
                                  +-----------------+------------------+
                                                    |
                                       [Access Request: Operation]
                                                    |
                     +------------------------------+------------------------------+
                     |                              |                              |
                     v                              v                              v
            [Operation: READ]              [Operation: WRITE]             [Operation: DELETE]
                     |                              |                              |
                     v                              v                              v
          +--------------------+         +--------------------+         +--------------------+
          | Is Confidential?   |         | Is State Closed?   |         | Is System Admin?   |
          | - No  -> Grant     |         | - Yes -> Admin Only|         | - No  -> Block     |
          | - Yes -> Owner/Adm |         | - No  -> Assigned  |         | - Yes -> Grant     |
          +----------+---------+         +----------+---------+         +----------+---------+
                     \                              |                              /
                      \                             v                             /
                       +-------------------> [answer = true] <-------------------+
                                                    |
                                                    v
                                      [Operation Permitted in UI/API]
```

### Business & Security Rules Enforced:
1. **Dynamic Confidentiality Barrier**: Public records remain visible to general personnel, while records flagged with `u_confidential = true` are strictly sequestered to assigned workers and elevated security reviewers.
2. **State-Based Immutability**: Closed or archived records are permanently locked against modifications from operational users, preventing data tampering.
3. **Destruction Prevention**: Deletion of records is restricted to security administrators to ensure organizational compliance and audit trails.

---

## Roles and Permissions Matrix

| Persona | Role Identifier | Read Public | Read Confidential | Update Active | Update Closed | Delete |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Security Administrator** | `admin`, `security_admin` | Yes | Yes | Yes | Yes | Yes |
| **Compliance Reviewer** | `u_acl_reviewer` | Yes | Yes | No | No | No |
| **Assigned Worker** | `u_acl_custom_user` | Yes | Yes (Own only) | Yes (Own only) | No | No |
| **General User** | `u_acl_custom_user` | Yes | No | No | No | No |

---

## Script Implementations

### 1. Read ACL Script (`scripts/read_acl.js`)
```javascript
answer = checkReadAccess();

function checkReadAccess() {
    if (current.u_confidential == false || current.u_confidential == 'false' || current.u_confidential.nil()) {
        return true;
    }
    var currentUser = gs.getUserID();
    if (gs.hasRole('u_acl_admin') || gs.hasRole('u_acl_reviewer') || gs.hasRole('admin')) {
        return true;
    }
    if (!current.u_assigned_to.nil() && current.u_assigned_to == currentUser) {
        return true;
    }
    if (!current.opened_by.nil() && current.opened_by == currentUser) {
        return true;
    }
    return false;
}
```

### 2. Write ACL Script (`scripts/write_acl.js`)
```javascript
answer = checkWriteAccess();

function checkWriteAccess() {
    var status = current.u_status ? current.u_status.toString().toLowerCase() : '';
    if (status === 'closed' || status === 'cancelled' || status === 'archived') {
        return gs.hasRole('admin') || gs.hasRole('u_acl_admin');
    }
    var currentUser = gs.getUserID();
    if (gs.hasRole('u_acl_admin') || gs.hasRole('admin')) {
        return true;
    }
    if (!current.u_assigned_to.nil() && current.u_assigned_to == currentUser) {
        return true;
    }
    return false;
}
```

---

## Testing & Validation Matrix

| Test ID | Operation | User / Persona | Condition Tested | Expected Result | Actual Result | Status |
|:---:|:---:|---|---|---|---|:---:|
| **TC-01** | `read` | `test.user` | `u_confidential = false` | Record visible | Record visible | **PASS** |
| **TC-02** | `read` | `test.user` | `u_confidential = true` (unassigned) | Access Denied | Hidden in list/form | **PASS** |
| **TC-03** | `read` | `assigned.worker` | `u_confidential = true` (assigned) | Record visible | Accessible | **PASS** |
| **TC-04** | `read` | `audit.reviewer` | `u_confidential = true` | Record visible | Accessible | **PASS** |
| **TC-05** | `write` | `assigned.worker` | `u_status = 'In Progress'` | Changes saved | Form savable | **PASS** |
| **TC-06** | `write` | `assigned.worker` | `u_status = 'Closed'` | Access Denied | Form read-only | **PASS** |
| **TC-07** | `create` | `test.user` | Standard insert | New record created | Record created | **PASS** |
| **TC-08** | `delete` | `test.user` | Any record | Delete prohibited | Delete button hidden | **PASS** |
| **TC-09** | `delete` | `admin` | Active non-locked record | Record deleted | Record removed | **PASS** |

---

## Repository Organization

```
ServiceNow-Script-Controlled-ACL/
|-- README.md                      # Master enterprise project documentation
|-- docs/
|   |-- architecture.md            # System architecture and technical design
|   |-- configuration-guide.md     # Step-by-step ServiceNow setup instructions
|   |-- security-model.md          # Roles, ACL hierarchy, and security matrix
|   +-- testing-guide.md           # Test cases, execution evidence, and validation
|-- export/
|   +-- sys_security_acl_export.xml# XML export definition of custom ACLs
+-- scripts/
    |-- create_acl.js              # Script-controlled Create ACL
    |-- delete_acl.js              # Script-controlled Delete ACL
    |-- read_acl.js                # Script-controlled Read ACL
    +-- write_acl.js               # Script-controlled Write ACL
```

---

## Setup & Deployment Instructions

1. **Access Instance**:
   - Navigate to the verified instance: [https://dev445323.service-now.com](https://dev445323.service-now.com).
   - Log in with System Administrator credentials.
2. **Elevate Permissions**:
   - Click user profile avatar > **Elevate Roles** > Select `security_admin` > **OK**.
3. **Import XML / Configure ACLs**:
   - Navigate to **System Security > Access Control (ACL)**.
   - Import the XML definitions from `export/sys_security_acl_export.xml` or configure rules using scripts in `scripts/`.
4. **Validate Access**:
   - Utilize ServiceNow User Impersonation to execute verification test cases **TC-01** through **TC-09**.

---

## Verified Project Links

- **New GitHub Repository**: [https://github.com/Dhanu754/ServiceNow-Script-Controlled-ACL](https://github.com/Dhanu754/ServiceNow-Script-Controlled-ACL)
- **Live Demo Instance**: [https://dev445323.service-now.com](https://dev445323.service-now.com)
