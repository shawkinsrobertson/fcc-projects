# Daily Build Notes and JTBD

## JTBD (end date: 11/06/2026)
- [ ] Write rules for data handling and behavior (see ?s to build toward)
- [x] Write through logic/behavior for project create/edit/delete, list create/edit/delete, leftover task destinations
- [ ] Test behavior functions
- [x] Render everything to UI or log to console to see each step and what breaks
- [ ] Write errors, dialogues, and empty states
- [ ] UI: architecture, affordances, validation, layout, animations, responsiveness
- [ ] Sort, Filter, and Search functions
- [ ] Task, Project, and List forms should mimic their rendered components (task card, project and list dashboards)
- [ ] PR once dashboard and reset/discard bugs are fixed

----------------------------------------------------------------------------------------------

### 11/11/2026
- Created
  - toggling for `.menu-sidebar` with responsive header
  - Added checkboxes to task cards to mark them complete
  - Logic for changing appearance of task cards once marked complete (saved state in new key `completed` with boolean from checked status on input, used saved state for re-rendering)
  - Started collapsable multi-purpose add button with expanding button menu for different creation types (task, project, list)
  - Refactored task creation into helper function for multiple task rendering endpoints
  - Light styling adjustments to task cards, app header, fonts

- Troubleshooting
  - storing completed status on tasks and re-rendering after DOM reload
  - some CSS selectors working against each other causing very narrow task container in the UI


- STILL TO DO
  - `reset()` on the `discardBtn` does not reset by type. Causing UI issues.
  - After editing a task inside a project the task-container is visible under the filtered task list.
  - ~~'create project' and 'create list' buttons.~~
  - Create ability to add a task inside a project or list
  - ~~Refactor repeating rendering for tasks~~

### 11/10/2026
- Created
  - `editList()`, `deleteList()`, `updateDashboard(type)`, and updated `reset()` function to take type 'project' or 'list'. 
  - Close form buttons for project and list forms w/ event listeners.
  - Logic in `deleteList()` and `deleteProject()` that goes through `taskData` and removes project or list from tasks that match one being deleted.
  - Organized script.js code for easier navigation and readability. 

- Fixed
  - `editProject()`, `editList()` edit the project and list data and update the UI.
  - Updated `renderProject()` and `renderList()` to include the description line when rendering, and changed the description textarea to a paragraph element for rendering.

- Bugs
  - `reset()` on the `discardBtn` does not reset by type. Causing UI issues.
  - After editing a task inside a project the task-container is visible under the filtered task list.

- Needs testing
  - ~~Does the task filter/remove project and list logic actually work and do tasks return to the primary task container?~~
  - Write out each primary user flow and observe what happens in logic and rendering. 

- Additional notes
  - I keep wanting a 'create project' and 'create list' button. Perhaps a combined '+' button at the top can serve this purpose. Right now there is no way to create a list or project outside of task creation. Alternatively, there is no way to add a task inside a project or list. Both things should be present before shipping.


### 11/09/2026
- Created
  - `renderProject()`, `renderList()`, `editProject()`
  - DOM elements for project and list dashboards that render filtered lists of tasks based on project or list association. Dashboards have `edit` and `delete` buttons (edit is wired for projects)
  - event listeners for project and list entries in the sidebar
  - event listeners for add or update project/list buttons (empty functions for now)

- Fixed
  - duplication issues with projects and lists by placing randomUUID creation inside of `addOrUpdateTask()`, `createProject()`, and `createList()`  instead of global variable, as that was rendering one ID per browser session and attaching same ID to all things. Also added normalization to project and list titles and inputs so searching by title would render proper matches. 
  - Still working on empty string and null values creating list and project entries.
  - `formattedDate` removed from global variables and storage logic as it was causing date to not render properly when entry was edited. Used now only in rendering steps. 
  - Fussed a very long time with getting task and project card buttons to behave as desired after putting them in their own div. Used `.closest()` to target nearest project div and added a `data-project` attribute on the project dashboard to link elements and actions.

- Didn't get to
  - ~~Can edit a project but it doesn't update the project entry~~
  - ~~project description does not render when project dashboard renders (currently a textarea entry - need to update to paragraph line)~~
  - ~~Need to repeat logic sequence and wiring for lists~~
  - ~~Need task updates when their projects and lists are deleted (return to null and rendered in general task list)~~


### 11/06/2026
- Created 
    - `createProject()`, `deleteProject()`,  `updateProjectContainer()` 
    - `createList()`, `deleteList()`, `updateListContainer()`
    - Debugging buttons: `#delete-projects-btn` and `#delete-lists-btn`
    - `formattedDate` global variable for `dateInput.value` formatting before storing in tasks, projects, lists


- Tested
    Success:
     - Does a project get created with a truthy `projectInput.value`? - Y
     - Does a list get created with a truthy `listInput.value`?  - Y
     - Does `updateProjectContainer()` add new projects to the project container after adding a task with a truthy `projectInput.value`? - Y
     - Does `updateListtContainer()` add new lists to the list container after adding a task with a truthy `listtInput.value`? - Y

    Failure:
    - Does a project get created with a null value - Y
    - Does a list get created with a null value - Y


- Questions to Build Toward
    - Is the current schema (separate DBs for tasks, projects, lists) the right level of complexity for this data?
    - What happens to associated tasks when their projects and/or lists are deleted?
    - How to properly handle null for task inputs? Do I need default values for list and/or project? Should I let the user change those defaults later in a settings menu?
    - What are all the edge cases for task, project, list creation, editing, deletion, and the relationships between these three things inside these actions? How should things fail, what gets communicated (and when), and what are the rules for how the data is handled (first rule: tasks should never be deleted/lost unless user deliberately deletes them)?