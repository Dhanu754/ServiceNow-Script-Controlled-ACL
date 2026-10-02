/**
 * Script-Controlled ACL: DELETE
 * Table: u_confidential_records
 * Operation: delete
 * 
 * Logic:
 * Records cannot be deleted if marked active or confidential unless user is System Administrator.
 */

answer = checkDeleteAccess();

function checkDeleteAccess() {
    if (!gs.hasRole('admin') && !gs.hasRole('u_acl_admin')) {
        return false;
    }

    // Do not permit deletion if record is marked protected/confidential
    if (current.u_confidential == true && !gs.hasRole('admin')) {
        return false;
    }

    return true;
}
