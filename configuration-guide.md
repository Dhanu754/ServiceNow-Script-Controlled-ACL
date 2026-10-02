# ServiceNow Configuration Guide

## Step-by-Step Implementation

### Step 1: Elevate Security Role
1. Navigate to the top banner and click the user avatar.
2. Select **Elevate Roles**.
3. Check `security_admin` and click **OK**.

### Step 2: Configure Custom Table & Fields
- **Table Name**: `u_confidential_records`
- **Fields Added**:
  - `u_number` (String, Read-only auto-number)
  - `u_short_description` (String, 100)
  - `u_confidential` (True/False, Default: false)
  - `u_status` (Choice: New, Work in Progress, Closed, Cancelled)
  - `u_assigned_to` (Reference to `sys_user`)

### Step 3: Configure Script-Controlled ACLs
1. Go to **System Security > Access Control (ACL)**.
2. Create New ACL for each operation (`read`, `write`, `create`, `delete`).
3. Set **Type**: `record`.
4. Set **Operation**: `read` (or `write`, `create`, `delete`).
5. Select target table: `u_confidential_records`.
6. Enable the **Advanced** checkbox.
7. Paste the respective script from `scripts/` directory.
8. Click **Submit** or **Update**.
