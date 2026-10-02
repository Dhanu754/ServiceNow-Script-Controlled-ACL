/**
 * Script-Controlled ACL: WRITE
 * Table: u_confidential_records
 * Operation: write
 * 
 * Logic:
 * Modification is allowed only if:
 * 1. The record is not closed/cancelled (field state check), AND
 * 2. User has admin role OR is assigned to the record
 */

answer = checkWriteAccess();

function checkWriteAccess() {
    // Restrict editing if the record is in a terminal status
    var status = current.u_status ? current.u_status.toString().toLowerCase() : '';
    if (status === 'closed' || status === 'cancelled' || status === 'archived') {
        // Only admin can modify terminal records
        return gs.hasRole('admin') || gs.hasRole('u_acl_admin');
    }

    var currentUser = gs.getUserID();

    // Admin and Reviewers have write access
    if (gs.hasRole('u_acl_admin') || gs.hasRole('admin')) {
        return true;
    }

    // Assigned owner can update active records
    if (!current.u_assigned_to.nil() && current.u_assigned_to == currentUser) {
        return true;
    }

    return false;
}
