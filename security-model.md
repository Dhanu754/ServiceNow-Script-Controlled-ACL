# Security Model & Access Matrix

## Roles and Responsibilities

| Role Name | Description | Read Access | Write Access | Create Access | Delete Access |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `admin` / `security_admin` | Platform Security Administrator | All Records | All Records | All Records | All Records |
| `u_acl_reviewer` | Auditor / Security Reviewer | All (incl. Confidential) | Denied | Denied | Denied |
| `u_acl_custom_user` | Business / Operational User | Public & Assigned Only | Assigned (if open) | Permitted | Denied |
| Public / Unauthenticated | Anonymous guest | Denied | Denied | Denied | Denied |

## Security Rules Enforced

### 1. Dynamic Confidentiality Barrier
- Non-confidential records (`u_confidential == false`) are visible to all authenticated users with standard read rights.
- Confidential records (`u_confidential == true`) require user match against `u_assigned_to`, `opened_by`, or elevation to `u_acl_reviewer`/`admin`.

### 2. State-Based Immutability
- Records in terminal states (`Closed`, `Cancelled`, `Archived`) cannot be edited by standard users.
- Field modifications require active administrative intervention once completed.

### 3. Destruction Protection
- Record deletion is disabled for business users to ensure compliance and audit trail preservation.
- Only users with `admin` and `security_admin` roles can delete records.
