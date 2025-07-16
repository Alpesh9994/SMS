# School (Tenant) Module – UI Workflows

## 1. School List Page
- Displays a table of all schools with columns: Name, Address, Admin Email, Actions.
- Actions include Edit (pencil icon) and Delete (trash icon).
- "Add School" button at the top right opens the add form.
- Loading spinner is shown while data is loading.
- Table uses Angular Material for a clean, modern look.

## 2. Add School Flow
- User clicks "Add School" on the list page.
- Navigates to `/school/new` and opens the common School Form.
- Form fields: Name, Address, Logo (optional), Admin Email, Board, Medium.
- All fields except Logo are required; Admin Email must be valid.
- On submit:
  - Shows loading state.
  - Calls backend to create school.
  - On success: navigates back to list and shows new school.
  - On error: logs error, stays on form.
- "Back" button returns to list without saving.

## 3. Edit School Flow
- User clicks Edit icon on a school row.
- Navigates to `/school/:id/edit` and opens the same School Form, pre-filled with school data.
- User can update any field.
- On submit:
  - Shows loading state.
  - Calls backend to update school.
  - On success: navigates back to list and shows updated school.
  - On error: logs error, stays on form.
- "Back" button returns to list without saving.

## 4. Delete School Flow
- User clicks Delete icon on a school row.
- Shows browser confirm dialog: "Are you sure you want to delete this school?"
- If confirmed:
  - Calls backend to delete school.
  - On success: reloads list.
  - On error: logs error, stays on list.
- If cancelled: no action taken.

## 5. Navigation & Error Handling
- All navigation uses Angular Router for smooth transitions.
- Errors in add/edit/delete are logged to console and do not crash the UI.
- UI is modern, minimal, and uses a calm color palette with lots of white space, rounded elements, and clear typography. 