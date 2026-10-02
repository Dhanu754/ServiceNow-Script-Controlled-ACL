# System Architecture & Technical Design

## Overview
This document outlines the architectural implementation of **Script-Controlled Access Control Lists (ACLs)** in ServiceNow. The primary design goal is dynamic, contextual security enforcement that restricts record and field access based on real-time field evaluation, user role assignment, and ownership conditions.

## Architectural Diagram

```
+--------------------------------------------------------------------------+
|                     ServiceNow Platform (Utah/Vancouver/Washington)       |
+--------------------------------------------------------------------------+
                                     |
                       [Incoming Transaction / Request]
                                     |
                                     v
                 +----------------------------------------+
                 |       GlideSecurityManager (ACL Engine) |
                 +----------------------------------------+
                                     |
       +-----------------------------+-----------------------------+
       |                             |                             |
       v                             v                             v
[Operation: READ]            [Operation: WRITE]           [Operation: DELETE]
       |                             |                             |
       v                             v                             v
+---------------+            +---------------+             +---------------+
| Read ACL      |            | Write ACL     |             | Delete ACL    |
| - Confidential|            | - State Check |             | - Admin Role  |
| - Owner Match |            | - Assigned To |             | - Unlocked    |
+---------------+            +---------------+             +---------------+
       \                             |                            /
        \                            v                           /
         +-----------------> [answer = true/false] <------------+
                                     |
                                     v
                       +---------------------------+
                       | Enforcement Decision:     |
                       | - true  -> Access Granted |
                       | - false -> Access Denied  |
                       +---------------------------+
```

## Security Evaluation Pipeline
When a user requests a record from `u_confidential_records` or an application table:
1. **Context Check**: ServiceNow resolves the current user context (`gs.getUserID()`, active roles).
2. **Field Evaluation**: The record's state (`current.u_status`) and sensitivity (`current.u_confidential`) are extracted.
3. **Script Execution**: The ACL JavaScript logic evaluates dynamic parameters.
4. **Enforcement**: Access is granted only when `answer === true`.
