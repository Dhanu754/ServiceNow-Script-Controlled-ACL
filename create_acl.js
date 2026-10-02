/**
 * Script-Controlled ACL: CREATE
 * Table: u_confidential_records
 * Operation: create
 * 
 * Logic:
 * Record creation is permitted for users holding appropriate operational roles.
 */

answer = checkCreateAccess();

function checkCreateAccess() {
    return gs.hasRole('u_acl_custom_user') || gs.hasRole('u_acl_admin') || gs.hasRole('admin');
}
