

// form and containers ---------------------------------------------------------------------
const taskForm = document.getElementById('task-form');
const projectForm = document.getElementById('project-form');
const listForm = document.getElementById('list-form');
const tasksContainer = document.getElementById('tasks-container');
const sidebar = document.querySelector('.menu-sidebar');
const projectContainer = document.getElementById('project-container');
const listContainer = document.getElementById('list-container');
const projectDashboard = document.getElementById('project-dashboard');
const listDashboard = document.getElementById('list-dashboard');
const projectTaskList = projectDashboard.querySelector('.filtered-task-list');
const listTaskList = listDashboard.querySelector('.filtered-task-list');
const projectDashboardDescription = projectDashboard.querySelector('.dashboard-description');
const projectDashboardTitle = projectDashboard.querySelector('.dashboard-title');
const listDashboardDescription = listDashboard.querySelector('.dashboard-description');
const listDashboardTitle = listDashboard.querySelector('.dashboard-title');
const todoApp = document.querySelector('.todo-app');
const createBtnDropdown = document.getElementById('button-dropdown');
const dashboardHeader = document.querySelectorAll('.dashboard-header');
const dashboard = document.querySelectorAll('.dashboard');
const taskFormHome = document.getElementById('task-form-home');
const forms = document.querySelectorAll('.form');

//buttons ---------------------------------------------------------------------
const addNewBtn = document.getElementById('add-new-btn');
const openTaskFormBtn = document.getElementById('open-task-form-btn');
const openProjectFormBtn = document.getElementById('open-project-form-btn');
const openListFormBtn = document.getElementById('open-list-form-btn');
const closeFormBtns = document.querySelectorAll('.close-form-btn');
const addOrUpdateTaskBtn = document.getElementById('add-or-update-task-btn');
const addOrUpdateProjectBtn = document.getElementById('add-or-update-project-btn');
const addOrUpdateListBtn = document.getElementById('add-or-update-list-btn');
const cancelBtn = document.getElementById('cancel-btn');
const editListBtn = document.getElementById('edit-list-btn');
const deleteListBtn = document.getElementById('delete-list-btn');
const editProjectBtn = document.getElementById('edit-project-btn');
const deleteProjectBtn = document.getElementById('delete-project-btn');
const sidebarCloseBtn = document.getElementById('logo');
const addTaskInlineBtn = document.querySelectorAll('.add-task-inline-btn');
const search = document.getElementById('search');
const sortAlphaBtn = document.getElementById('sort-alpha');
const sortDueFirstBtn = document.getElementById('sort-due-first');


// const deleteListsBtn = document.getElementById('delete-lists-btn');
// const deleteProjectsBtn = document.getElementById('delete-projects-btn');

//inputs and dialog ---------------------------------------------------------------------
const confirmCloseDialog = document.getElementById('confirm-close-dialog');
const discardBtn = document.getElementById('discard-btn');
const titleInput = document.getElementById('task-title-input');
const dateInput = document.getElementById('task-date-input');
const descriptionInput = document.getElementById('task-description-input');
const projectInput = document.getElementById('task-project-input');
const listInput = document.getElementById('task-list-input');
const parentInput = document.getElementById('task-parent-input');
const projectTitle = projectDashboard.querySelector('.dashboard-title');
const listTitle = listDashboard.querySelector('.dashboard-title');
const projectFormTitle = document.getElementById('project-title-input');
const projectFormDate = document.getElementById('project-date-input');
const projectFormDescription = document.getElementById('project-description-input');
const listFormTitle = document.getElementById('list-title-input');
const listFormDate = document.getElementById('list-date-input');
const listFormDescription = document.getElementById('list-description-input');

//data and storage ---------------------------------------------------------------------
const taskData = JSON.parse(localStorage.getItem('tasks')) || [];
const projectData = JSON.parse(localStorage.getItem('projects')) || [];
const listData = JSON.parse(localStorage.getItem('lists')) || [];
let currentTask = {};
let currentProject = {};
let currentList = {};

//functions
// const removeSpecialChars = (str) => {
//     const cleanStr = str.replace(/[^a-zA-Z0-9 ]/g, '');
//     return cleanStr;
// }
let alphaSort = false;
let dueDateSort = false;


//GENERAL HELPERS ---------------------------------------------------------------------
const reset = (type) => {
    if(type === 'task'){
        addOrUpdateTaskBtn.innerText = 'Add Task';
        titleInput.value = '';
        dateInput.value = '';
        projectInput.value = '';
        listInput.value = '';
        descriptionInput.value   = '';
        currentTask = {}; 
    };

    if(type === 'project') {
        addOrUpdateProjectBtn.innerText = 'Create Project';
        projectFormTitle.value = '';
        projectFormDate.value = '';
        projectFormDescription.value = '';
        currentProject = {}; 
    };

    if(type === 'list') {
        addOrUpdateListBtn.innerText = 'Create List';
        listFormTitle.value = '';
        listFormDate.value = '';
        listFormDescription.value   = '';
        currentList = {};
    };

    if(type === 'button') {
        addNewBtn.classList.toggle('selected');
        createBtnDropdown.classList.toggle('open');
    };

};

const hasChanges = (form, current = {}) => {
    const {
        title = '',
        date = '',
        description = '',
    } = Object.fromEntries(new FormData(form));

    const valuesChanged = title !== (current.title ?? '')|| date !== (current.date ?? '')|| description !== (current.description ?? '');
    if(valuesChanged) {
        confirmCloseDialog.showModal();
    } else {
        form.classList.toggle('hidden');
        reset(form.dataset.type);
    }
}

const toggleCollapsable = (el) => {
    const subtaskLists = Array.from(document.querySelectorAll('.subtask-container'));
    const subtaskList = subtaskLists.find(list => list.id === el.dataset.list);
    subtaskList.classList.toggle('hidden');
}

const sortByAlpha = () => {
    alphaSort = !alphaSort;
    if(alphaSort) {
    const sortedTasks = taskData.filter(task => !task.parentId).sort((a,b) => {
    return a.title < b.title ? -1 : 1});
    tasksContainer.replaceChildren(...sortedTasks.filter(task => !task.parentId).map(createTaskElement));
    sortAlphaBtn.classList.add('active');
   } else {
    tasksContainer.replaceChildren(...taskData.filter(task => !task.parentId).map(createTaskElement));
    sortAlphaBtn.classList.remove('active');
   }
    updateSubtaskContainer();
};

const sortByDueDate = () => {
    dueDateSort = !dueDateSort;
    if(dueDateSort) {
const sortedTasks = taskData.filter(task => !task.parentId).sort((a,b) => {
       const aMs = Date.parse(a.date);
       const bMs = Date.parse(b.date);
       return a.date < b.date ? -1 : 1;
    });
    tasksContainer.replaceChildren(...sortedTasks.filter(task => !task.parentId).map(createTaskElement));
    sortDueFirstBtn.classList.add('active');
    } else {
    tasksContainer.replaceChildren(...taskData.filter(task => !task.parentId).map(createTaskElement));
    sortDueFirstBtn.classList.remove('active');
    };
    updateSubtaskContainer();  
};


//TASKS ---------------------------------------------------------------------
const addOrUpdateTask = () => {
    const visibleDashboard = [projectDashboard, listDashboard]
        .find(dashboard => getComputedStyle(dashboard).display !== 'none');
    if(!titleInput.value.trim()){
        alert('Please provide a title. Tasks without names cannot be accomplished.');
        return;
    }
    const dataArrIndex = taskData.findIndex(item => item.id === currentTask.id);
    const parentTask = taskData.find(item => item.title.trim().toLowerCase() === parentInput.value.trim().toLowerCase());
    const projectTitle = projectInput.value.trim();
    const listTitle = listInput.value.trim();
    const projectExists = projectData.some(project => project.title.trim().toLowerCase() === projectTitle.toLowerCase());
    const listExists = listData.some(list => list.title.trim().toLowerCase() === listTitle.toLowerCase());
    const taskObj = {
        id: currentTask.id || crypto.randomUUID(),
        timestamp: Date.now(),
        title: titleInput.value,
        date: dateInput.value,
        project: projectTitle ?? null, //should we use project and list id instead of title for storage and future rendering?
        list: listTitle ?? null,
        parentId: parentTask.id ?? null,
        description: descriptionInput.value,
        completed: currentTask.completed ?? false,
    };

    //not a current parent or child task, no parent task assigned - new primary task
    if(projectTitle && !projectExists) {
        createProject();
    }
    if(listTitle && !listExists) {
        createList();
    }
    if(dataArrIndex === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[dataArrIndex] = taskObj;
    }

    localStorage.setItem('tasks', JSON.stringify(taskData));
    if(visibleDashboard) {
        const tasksToRender = taskData.filter(tasks => tasks.project === projectTitle);
        projectTaskList.replaceChildren(...tasksToRender.map(createTaskElement));
        feather.replace();
    }else {
        updateTaskContainer();
        updateSubtaskContainer();
    };
    updateProjectContainer();
    updateListContainer();
    reset('task');
};

const deleteTask = (buttonEl) => {
    const taskCard = buttonEl.closest('.task');
    const dataArrIndex = taskData.findIndex(item => item.id === taskCard.id);
    if(dataArrIndex === -1) {
        alert('Task not found.');
        return;
    };

    buttonEl.closest('.task').remove();
    taskData.splice(dataArrIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(taskData));
};

const editTask = (buttonEl) => {
    const taskCard = buttonEl.closest('.task, .subtask');
    taskForm.classList.toggle('hidden');
    const dataArrIndex = taskData.findIndex(item => item.id === taskCard.id);
    currentTask = taskData[dataArrIndex];
    const parentTaskName = taskData.find(task => task.id === currentTask.parentId);
    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    projectInput.value = currentTask.project;
    listInput.value = currentTask.list;
    parentInput.value = parentTaskName.title;
    descriptionInput.value = currentTask.description;
    addOrUpdateTaskBtn.innerText = 'Update Task';

};

const updateTaskContainer = () => {
    tasksContainer.replaceChildren(...taskData.filter(task => !task.parentId).map(createTaskElement));
    feather.replace();
};

const updateSubtaskContainer = () => {
    document.querySelectorAll('.subtask-container').forEach(container => {
        const parentTask = container.closest('.task');
        const subtasks = taskData.filter(task => task.parentId === parentTask.id);
        container.replaceChildren(...subtasks.map(createTaskElement));
    })

    feather.replace();
};

const createTaskElement = (task) => {
    const card = document.createElement('div');

    //for subtasks
    if(task.parentId) {
        card.className = 'subtask';
        card.id = task.id;
        card.classList.toggle('completed', Boolean(task.completed));

        const checkboxTitleContainer = document.createElement('div');
        checkboxTitleContainer.className = 'task-checkbox';

        const checkbox = document.createElement('input');
        checkbox.id = task.id
        checkbox.type = 'checkbox';
        checkbox.name = 'status';
        checkbox.value = 'status';
        checkbox.checked = Boolean(task.completed);

        const title = document.createElement('label');
        title.className = 'subtask-title';
        title.htmlFor = task.id;
        title.textContent = task.title;

        checkboxTitleContainer.append(checkbox, title);

        const actions = document.createElement('div');
        actions.className = 'form-btn-div';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'btn';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(editButton));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(deleteButton));

        actions.append(editButton, deleteButton);

        card.append(checkboxTitleContainer, actions);

    } else { //for parent tasks
        card.className = 'task';
        card.id = task.id;
        card.classList.toggle('completed', Boolean(task.completed));

        const header = document.createElement('div');
        header.className = 'task-header';

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'task-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'status';
        checkbox.value = 'status';
        checkbox.checked = Boolean(task.completed);
        


        const title = document.createElement('p');
        title.className = 'task-title';
        title.textContent = task.title;
        checkboxContainer.append(checkbox, title);

        const actions = document.createElement('div');
        actions.className = 'form-btn-div';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'btn';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(editButton));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(deleteButton));

        actions.append(editButton, deleteButton);
        header.append(checkboxContainer, actions);

        const body = document.createElement('div');
        body.className = 'task-body';

        const content = document.createElement('div');
        content.className = 'task-content';


        if (task.date) {
            const date = document.createElement('p');
            date.className = 'task-date';
            date.textContent = task.date.split('-').reverse().join('/');
            content.append(date);
        }

        if (task.project) {
            const project = document.createElement('p');
            project.className = 'task-project-label';
            project.textContent = task.project;
            content.append(project);
        }

        if (task.list) {
            const list = document.createElement('p');
            list.className = 'task-list-label';
            list.textContent = task.list;
            content.append(list);
        }

        if (task.description) {
            const description = document.createElement('p');
            description.className = 'task-description';
            description.textContent = task.description;
            content.append(description);
        }


        const subtasks = document.createElement('div');
        subtasks.className = 'subtasks';


        const subtasksHeader = document.createElement('div');
        subtasksHeader.className = 'subtasks-header';

        if(taskData.some(item => item.parentId === task.id)) {
            const collapseBtn = document.createElement('button');
            collapseBtn.className = 'icon-btn';
            collapseBtn.dataset.list = task.id;
            collapseBtn.addEventListener('click', () => toggleCollapsable(collapseBtn));

            const icon = document.createElement('i');
            icon.dataset.feather = 'chevron-down';

            collapseBtn.append(icon);
            subtasksHeader.append(collapseBtn);
        };

        
        const subtasksTitle = document.createElement('p');
        subtasksTitle.className = 'subtasks-title';
        subtasksTitle.textContent = 'subtasks';

        const addSubtasksBtn = document.createElement('button');
        addSubtasksBtn.className = 'btn';
        addSubtasksBtn.textContent = '+ add';

        subtasksHeader.append(subtasksTitle, addSubtasksBtn);

        const subtaskContainer = document.createElement('div');
        subtaskContainer.className = 'subtask-container';
        subtaskContainer.id = task.id;
        
        subtasks.append(subtasksHeader, subtaskContainer);

        body.append(content);
        card.append(header, body, subtasks);

    };
    
    return card;
};


//PROJECTS ---------------------------------------------------------------------
const addOrUpdateProject = () => {
    if(!projectFormTitle.value.trim() && !projectTitle){
        alert('Please give your project a name; otherwise, it cannot materialize.');
        return;
    };
    const dataArrIndex = projectData.findIndex(project => project.id === currentProject.id);
    const projectObj = {
        id: currentProject.id || `project-${crypto.randomUUID()}`,
        date: projectFormDate.value || dateInput.value,
        title: projectFormTitle.value.trim() || projectInput.value.trim(),
        description: projectFormDescription.value || null,
    };
    if(dataArrIndex === -1) {
        projectData.unshift(projectObj);
    } else {
        projectData[dataArrIndex] = projectObj;
    };

    localStorage.setItem('projects', JSON.stringify(projectData));
    updateProjectContainer();
    updateDashboard('project');
    projectForm.classList.toggle('hidden');
};

const createProject = () => { 
    const projectObj = {
        id: `project-${crypto.randomUUID()}`,
        date: dateInput.value,
        title: projectInput.value.trim(),
        description: '',
    }
    projectData.unshift(projectObj);
    localStorage.setItem('projects', JSON.stringify(projectData));
};

const editProject = (buttonEl) => {
    const projectCard = buttonEl.closest('[data-project]');
    const lookupTitle = projectCard.querySelector('.dashboard-title').innerHTML;
    projectForm.classList.toggle('hidden');
    const dataArrIndex = projectData.findIndex(project => project.title === lookupTitle);
    currentProject = projectData[dataArrIndex];
    projectFormTitle.value = currentProject.title;
    projectFormDate.value = currentProject.date;
    projectFormDescription.value = currentProject.description;
    addOrUpdateProjectBtn.innerText = 'Update Project';

};

const deleteProject = (buttonEl) => {
    const projectCard = buttonEl.closest('[data-project]');
    const lookupTitle = projectCard.querySelector('.dashboard-title').innerHTML;
    console.log(lookupTitle)
    const dataArrIndex = projectData.findIndex(project => project.title === lookupTitle);
    const projectToClear = projectData[dataArrIndex];
    if(dataArrIndex === -1) {
        alert(`This project doesn't exist. Are you looking for a different project?`);
        return;
    } else {
        projectData.splice(dataArrIndex, 1);
        taskData.forEach((task) => {
            if(task.project === projectToClear.title) {
                task.project = null;
            };
        });
    };
    localStorage.setItem('projects', JSON.stringify(projectData));
    localStorage.setItem('tasks', JSON.stringify(taskData));
    updateProjectContainer();
    updateTaskContainer();
    clearDashboard('project');
};

const updateProjectContainer = () => {
     projectContainer.innerHTML = '';
    projectData.forEach(({title}) => projectContainer.innerHTML += `
        <div class='project' id='${title}'>
            <p class='project-title'>${title}</p>
        </div>
    `)
};

//LISTS ---------------------------------------------------------------------
const addOrUpdateList = () => {
    if(!listFormTitle.value.trim() && !listTitle){
        alert('Please give your list a name; otherwise, it cannot materialize.');
        return;
    };
    const dataArrIndex = listData.findIndex(list => list.id === currentList.id);
    const listObj = {
        id: currentList.id || `list-${crypto.randomUUID()}`,
        date: listFormDate.value || dateInput.value,
        title: listFormTitle.value || listInput.value.trim(),
        description: listFormDescription.value || null,
    };

    if(dataArrIndex === -1) {
        listData.unshift(listObj);

    } else {
        listData[dataArrIndex] = listObj;
    }
    localStorage.setItem('lists', JSON.stringify(listData));
    updateListContainer();
    updateDashboard('list');
    listForm.classList.toggle('hidden');
    listDashboard.style.display = 'flex';
    tasksContainer.innerHTML = '';
};

const createList = () => {
    const listObj = {
        id: `list-${crypto.randomUUID()}`,
        date: dateInput.value,
        title: listInput.value.trim(),
        description: '',
    }
    listData.unshift(listObj);
    localStorage.setItem('lists', JSON.stringify(listData));
};

const editList = (buttonEl) => {
    const listCard = buttonEl.closest('[data-list]');
    const lookupTitle = listCard.querySelector('.dashboard-title').innerHTML;
    listForm.classList.toggle('hidden');
    const dataArrIndex = listData.findIndex(list => list.title === lookupTitle);
    currentList = listData[dataArrIndex];
    listFormTitle.value = currentList.title;
    listFormDate.value = currentList.date;
    listFormDescription.value = currentList.description;
    addOrUpdateListBtn.innerText = 'Update List';
}

const deleteList = (buttonEl) => {
    const listCard = buttonEl.closest('[data-list]');
    const lookupTitle = listCard.querySelector('.dashboard-title').innerHTML;
    console.log(lookupTitle)
    const dataArrIndex = listData.findIndex(list => list.title === lookupTitle);
    const listToClear = listData[dataArrIndex];
    if(dataArrIndex === -1) {
        alert(`This list doesn't exist. Are you looking for a different list?`);
        return;
    } else {
        listData.splice(dataArrIndex, 1);
        taskData.forEach((task) => {
            if(task.list === listToClear.title){
                task.list = null;
            }});
    };
    localStorage.setItem('lists', JSON.stringify(listData));
    localStorage.setItem('tasks', JSON.stringify(taskData));
    updateListContainer();
    updateTaskContainer();
    clearDashboard('list');
};

const updateListContainer = () => {
     listContainer.innerHTML = '';
    listData.forEach(({id, title}) => listContainer.innerHTML += `
        <div class='list' id='${title}'>
            <p class='list-title'>${title}</p>
        </div>
    `)
};


//UI RENDERING, ALL TYPES ---------------------------------------------------------------------
const updateDashboard = (type) => {
    if(type === 'project') {
        projectDashboardTitle.innerHTML = projectFormTitle.value;
        projectDashboardDescription.innerHTML = projectFormDescription.value;

    };
    if(type === 'list') {
        listDashboardTitle.innerHTML = listFormTitle.value;
        listDashboardDescription.innerHTML = listFormDescription.value;
    };
};

const renderProject = (e) => {
    tasksContainer.innerHTML = '';
    projectTaskList.innerHTML = '';
    listDashboard.style.display = 'none';
    const projectElement = e.target.closest('.project'); 
    const projectToRender = projectData.find(project => project.title === projectElement.id);
    const tasksToRender = taskData.filter(tasks => tasks.project === projectElement.id);
    projectDashboard.style.display = 'flex';
    projectDashboard.dataset.project = 'project';
    projectTitle.innerHTML = projectToRender.title;
    projectDashboardDescription.innerHTML = projectToRender.description ? projectToRender.description : '';
    projectTaskList.replaceChildren(...tasksToRender.map(createTaskElement));
    updateSubtaskContainer();
    feather.replace();
};

const renderList = (e) => {
   tasksContainer.innerHTML = '';
   listTaskList.innerHTML = '';
   projectDashboard.style.display = 'none';
   listDashboard.style.display = 'flex';
    const listElement = e.target.closest('.list');
    const listToRender = listData.find(list => list.title === listElement.id);
    listTitle.innerHTML = listToRender.title;
    listDashboard.dataset.list = 'list';
    listDashboardDescription.innerHTML = listToRender.description ? listToRender.description : '';
    const tasksToRender = taskData.filter(tasks => tasks.list === listElement.id);
    listTaskList.replaceChildren(...tasksToRender.map(createTaskElement));
    feather.replace();

};

const clearDashboard = (type) => {
    if(type === 'project') {
        projectDashboardTitle.innerHTML = '';
        projectDashboardDescription.innerHTML = '';
        projectDashboard.style.display = 'none';

    };
    if(type === 'list') {
        listDashboardTitle.innerHTML = '';
        listDashboardDescription.innerHTML = '';
        listDashboard.style.display = 'none';
    };
}

const setForm = () => {
    const visibleDashboard = [projectDashboard, listDashboard]
        .find(dashboard => getComputedStyle(dashboard).display !== 'none') || false;
    

    if(!visibleDashboard) {
        taskFormHome.after(taskForm);
    } else {
        const targetList = visibleDashboard.querySelector('.filtered-task-list');
        targetList.before(taskForm);
    }
    taskForm.classList.toggle('hidden');
}

const toggleFormViz = (formEl) => {
   forms.forEach(form => {form.classList.add('hidden')});

   if(formEl) {
    formEl.classList.toggle('hidden');
   }
}

if(taskData.length) {
    updateTaskContainer();
    updateSubtaskContainer()
}
if(projectData.length) {
    updateProjectContainer();
}
if(listData.length) {
    updateListContainer();
}


//EVENT LISTENERS ---------------------------------------------------------------------
addNewBtn.addEventListener('click', () => {
    addNewBtn.ariaExpanded = addNewBtn.ariaExpanded !== 'true' ? 'true' : 'false';
    reset('button');
});
openTaskFormBtn.addEventListener('click', (e) => {
    setForm();
    reset('button');
    toggleFormViz(taskForm);
});
openProjectFormBtn.addEventListener('click', () => {toggleFormViz(projectForm)});

openListFormBtn.addEventListener('click', () => {toggleFormViz(listForm)});

closeFormBtns.forEach(button => button.addEventListener('click', (e) => {
    const form = e.currentTarget.form;
    hasChanges(form);
}))

cancelBtn.addEventListener('click', () => {confirmCloseDialog.close()});

discardBtn.addEventListener('click', () => {
    confirmCloseDialog.close()
    const currentForm = [taskForm, projectForm, listForm]
        .find(form => getComputedStyle(form).display !== 'none');
    reset(currentForm.dataset.type);
    currentForm.classList.toggle('hidden');
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addOrUpdateTask(e);
});

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addOrUpdateProject();
});

listForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addOrUpdateList();
});

editProjectBtn.addEventListener('click', (e) => editProject(e.currentTarget));

deleteProjectBtn.addEventListener('click', (e) => deleteProject(e.currentTarget));

editListBtn.addEventListener('click', (e) => editList(e.currentTarget));

deleteListBtn.addEventListener('click', (e) => deleteList(e.currentTarget));

projectContainer.addEventListener('click', (e) => {
    if(e.target.closest('.project')) {
        renderProject(e);
    }
});

listContainer.addEventListener('click', (e) => {
    if(e.target.closest('.list')) {
        renderList(e);
    }
});

sidebarCloseBtn.addEventListener('click', () => {
    const isCollapsed = sidebar.classList.toggle('collapsed');
    const projectIconBtn = document.querySelector('#projects-header-sidebar .icon-btn');
    const listIconBtn = document.querySelector('#lists-header-sidebar .icon-btn');
    projectIconBtn.innerHTML = `<i data-feather="${isCollapsed ? 'folder' : 'folder-plus'}"></i>`;
    listIconBtn.innerHTML = `<i data-feather="${isCollapsed ? 'file' : 'file-plus'}"></i>`;
    feather.replace();
})

todoApp.addEventListener('change', (event) => {
    if (!event.target.matches('.task input[type="checkbox"], .subtask input[type="checkbox"]')) return;

    const taskElement = event.target.closest('.task, .subtask');
    const taskToUpdate = taskData.find(task => task.id === taskElement.id);
    if (!taskToUpdate) return;

    taskToUpdate.completed = event.target.checked;
    taskElement.classList.toggle('completed', taskToUpdate.completed);
    localStorage.setItem('tasks', JSON.stringify(taskData));
});

addTaskInlineBtn.forEach(button => button.addEventListener('click', () => {
    setForm();
}));

search.addEventListener('input', (e) => { //searches current task list only
    const query = e.target.value.trim().toLowerCase();
    const searchList = document.getElementById('tasks-container');
    const items = searchList.querySelectorAll('.task-content');

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const card = item.closest('.task');

        card.style.display = text.includes(query) ? 'flex' : 'none';
    });

});


sortAlphaBtn.addEventListener('click', () => sortByAlpha());

sortDueFirstBtn.addEventListener('click', () => sortByDueDate());


//temp event listeners for testing purposes. delete later!
// deleteProjectsBtn.addEventListener('click', () => {
//     projectData.length = 0;
//     localStorage.removeItem('projects');
//     updateProjectContainer();
// });
// deleteListsBtn.addEventListener('click', () => {
//     listData.length = 0;
//     localStorage.removeItem('lists');
//     updateListContainer();
// });