# To-Do App

## Current State
    - basic CRUD from localStorage
    - simple form with edit/delete/update buttons, cancel/discard modal
    - barebones UI, no responsiveness in design


## Next Steps
    - [ ] Decide: vanilla JS or convert to React?
    - [ ] Change display habits for modal
    - [ ] Update UI (colors, fonts, buttons, animations, microinteractivity)
    - [ ] Consider PWA architecture if using in browser && not using React

## Be Sure to
    - [ ] Document design, architecture, and data decisions and tradeoffs
    - [ ] Find something unique to develop so project is yours
    - [ ] Use best practices in Git, documentation, repo, Accessibility, etc.



## IDEAS
    - Tags for categories and for searching by categories and/or displaying in directories
    - Multiple lists
    - Ability to create projects (how does that interact with tags?)
    - Dictation (speech-to-text) or audio notes
    - Media upload: files, images
    - Synchronization w/ desktop client via device pairing/local network (QR code) (is this a one-way sync or can data be updated based on latest information from either device?)
    - Reminders, due dates, time tracking, recurring tasks
    - Subtasks
    - Description accepts and renders markdown
    - Interactivity:
        - drag and drop
        - tasks + subtasks move in and out from under other tasks/become main or subtasks based on those states
        - tasks moved to different lists (requires multiple lists)
        - reordering
        - listing by due date
        - showing/hiding completed tasks
        - long press or swipe to delete (on small screens)
        - option to select multiple tasks/batch delete



## Nouns, Verbs, Actions

    ### Nouns
    - app container
    - menu/sidebar
    - task form
    - task card
    - project list
    - list of lists
    - inputs:
        - task(title)
        - date
        - project attachment?
        - list attachment? (default to general task dump/master list)
        - description
        - parent task? (for subtasks)

    ### Verbs
    - create
    - edit
    - delete
    - assign/unassign
    - expand/collapse


    ### Actions

    Create Task

        ````mermaid

        flowchart TD
        A[click 'Add Task'] --> B[task form opens];
        B[task form opens] --> C[title];
        C --> D[date];
        D --> E(project?);
        E -- yes --> I(existing project?);
        I -- yes --> J[assign to project];
        I --no --> K[create new project];
        K --> J;
        E -- no --> F(list?);
        J --> F;
        F -- yes --> M(existing list?);
        M -- yes --> N[assign to list];
        M -- no --> O[create new list];
        O --> N;
        F -- no --> P[assign to default list];
        N --> G[description];
        P --> G;
        G --> H(parent task?);
        H -- yes --> Q[assign to parent task];
        H -- no --> L[save task];
        Q --> L;   

        ```

        if(project) //save to project object, render project title to sidebar
        if(list) //save to list object, render list title to sidebar

        list titles are links that render contents to main when clicked
        