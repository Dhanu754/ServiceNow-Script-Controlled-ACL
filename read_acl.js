/**
 * Script-Controlled ACL: READ
 * Table: u_confidential_records (or target application table)
 * Operation: read
 * 
 * Logic:
 * Access is granted if:
 * 1. The record is not marked confidential, OR
 * 2. The logged-in user has the security/admin role ('u_acl_admin'), OR
 * 3. The logged-in user is the assigned owner ('u_assigned_to'), OR
 * 4. The logged-in user is the creator of the record ('opened_by' / 'sys_created_by')
 */

answer = checkReadAccess();

function checkReadAccess() {
    // If record is not confidential, permit read
    if (current.u_confidential == false || current.u_confidential == 'false' || current.u_confidential.nil()) {
        return true;
    }

    var currentUser = gs.getUserID();

    // Check if user has administrative or reviewer role
    if (gs.hasRole('u_acl_admin') || gs.hasRole('u_acl_reviewer') || gs.hasRole('admin')) {
        return true;
    }

    // Check if user is the assigned person
    if (!current.u_assigned_to.nil() && current.u_assigned_to == currentUser) {
        return true;
    }

    // Check if user opened or created the record
    if (!current.opened_by.nil() && current.opened_by == currentUser) {
        return true;
    }

    // Otherwise, deny read access
    return false;
}
