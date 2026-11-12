

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

//buttons ---------------------------------------------------------------------
const addNewBtn = document.getElementById('add-new-btn');
const openTaskFormBtn = document.getElementById('open-task-form-btn');
const openProjectFormBtn = document.getElementById('open-project-form-btn');
const openListFormBtn = document.getElementById('open-list-form-btn');
const closeTaskFormBtn = document.getElementById('close-task-form-btn');
const addOrUpdateTaskBtn = document.getElementById('add-or-update-task-btn');
const addOrUpdateProjectBtn = document.getElementById('add-or-update-project-btn');
const addOrUpdateListBtn = document.getElementById('add-or-update-list-btn');
const cancelBtn = document.getElementById('cancel-btn');
const closeProjectFormBtn = document.getElementById('close-project-form-btn');
const closeListFormBtn = document.getElementById('close-list-form-btn');
const editListBtn = document.getElementById('edit-list-btn');
const deleteListBtn = document.getElementById('delete-list-btn');
const editProjectBtn = document.getElementById('edit-project-btn');
const deleteProjectBtn = document.getElementById('delete-project-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

const deleteListsBtn = document.getElementById('delete-lists-btn');
const deleteProjectsBtn = document.getElementById('delete-projects-btn');

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
        projectFormDate.value = '';
        currentProject = {}; 
    };

    if(type === 'list') {
        addOrUpdateListBtn.innerText = 'Create List';
        listFormTitle.value = '';
        listFormDate.value = '';
        listFormDescription.value   = '';
        currentList = {};
    };

};


//TASKS ---------------------------------------------------------------------
const addOrUpdateTask = () => {
    if(!titleInput.value.trim()){
        alert('Please provide a title. Tasks without names cannot be accomplished.');
        return;
    }
    const dataArrIndex = taskData.findIndex(item => item.id === currentTask.id);
    const parentTask = taskData.filter(item => item.title === parentInput.value);
    const projectTitle = projectInput.value.trim();
    const listTitle = listInput.value.trim();
    const projectExists = projectData.some(project => project.title.trim().toLowerCase() === projectTitle.toLowerCase());
    const listExists = listData.some(list => list.title.trim().toLowerCase() === listTitle.toLowerCase());
    const taskObj = {
        id: currentTask.id || crypto.randomUUID(),
        timestamp: Date.now(),
        title: titleInput.value,
        date: dateInput.value,
        project: projectTitle || null, //should we use project and list id instead of title for storage and future rendering?
        list: listTitle || null,
        parentId: parentTask.id || null,
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
    updateTaskContainer();
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
    const taskCard = buttonEl.closest('.task');
    taskForm.classList.toggle('hidden');
    const dataArrIndex = taskData.findIndex(item => item.id === taskCard.id);
    currentTask = taskData[dataArrIndex];
    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    projectInput.value = currentTask.project;
    listInput.value = currentTask.list;
    parentInput.value = currentTask.parentId;
    descriptionInput.value = currentTask.description;
    addOrUpdateTaskBtn.innerText = 'Update Task';

};

const updateTaskContainer = () => {
    tasksContainer.replaceChildren(...taskData.map(createTaskElement));
};

const createTaskElement = (task) => {
    const card = document.createElement('div');
    card.className = 'task';
    card.id = task.id;
    card.classList.toggle('completed', Boolean(task.completed));

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

    const body = document.createElement('div');
    body.className = 'task-body';

    const content = document.createElement('div');
    content.className = 'task-content';

    const title = document.createElement('p');
    title.textContent = task.title;
    content.append(title);

    if (task.date) {
        const date = document.createElement('p');
        date.textContent = task.date.split('-').reverse().join('/');
        content.append(date);
    }

    if (task.project) {
        const project = document.createElement('p');
        project.textContent = task.project;
        content.append(project);
    }

    if (task.list) {
        const list = document.createElement('p');
        list.textContent = task.list;
        content.append(list);
    }

    if (task.description) {
        const description = document.createElement('p');
        description.textContent = task.description;
        content.append(description);
    }

    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'task-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'status';
    checkbox.value = 'status';
    checkbox.checked = Boolean(task.completed);
    checkboxContainer.append(checkbox);

    body.append(content, checkboxContainer);
    card.append(actions, body);
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
    const listCard = buttonEl.closest('[data-list');
    const lookupTitle = listCard.querySelector('.dashboard-title').innerHTML;
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

if(taskData.length) {
    updateTaskContainer();
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
    addNewBtn.classList.toggle('selected');
    createBtnDropdown.classList.toggle('open'); // these actions can be placed in a helper since they will need to trigger for the other form buttons once clicked
});
openTaskFormBtn.addEventListener('click', () => {
    taskForm.classList.toggle('hidden');
});
openProjectFormBtn.addEventListener('click', () => {projectForm.classList.toggle('hidden')});
openListFormBtn.addEventListener('click', () => {listForm.classList.toggle('hidden')});

closeTaskFormBtn.addEventListener('click', () => {
    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;
    if(titleInput.value || dateInput.value || descriptionInput.value && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        taskForm.classList.toggle('hidden')
        reset('task');
    }
});

closeProjectFormBtn.addEventListener('click', () => {
    const formInputValuesUpdated = projectFormTitle.value !== currentProject.title || projectFormDate.value !== currentProject.date || projectFormDescription.value !== currentProject.description;
    if(projectFormTitle.value || projectFormDate.value || projectFormDescription.value && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        //projectForm.classList.toggle('hidden')
        reset('project');
    }
});

closeListFormBtn.addEventListener('click', () => {
    const formInputValuesUpdated = listFormTitle.value !== currentList.title || listFormDate.value !== currentList.date || listFormDescription.value !== currentList.description;
    if(listFormTitle.value || listFormDate.value || listFormDescription.value && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        listForm.classList.toggle('hidden')
        reset('list');
    }
});

cancelBtn.addEventListener('click', () => {confirmCloseDialog.close()});

discardBtn.addEventListener('click', () => {
    confirmCloseDialog.close()
    reset(); // this does not reset all forms
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addOrUpdateTask();
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
    sidebar.classList.toggle('collapsed');
})

todoApp.addEventListener('change', (event) => {
    if (!event.target.matches('.task input[type="checkbox"]')) return;

    const taskElement = event.target.closest('.task');
    const taskToUpdate = taskData.find(task => task.id === taskElement.id);
    if (!taskToUpdate) return;

    taskToUpdate.completed = event.target.checked;
    taskElement.classList.toggle('completed', taskToUpdate.completed);
    localStorage.setItem('tasks', JSON.stringify(taskData));
});



//temp event listeners for testing purposes. delete later!
deleteProjectsBtn.addEventListener('click', () => {
    projectData.length = 0;
    localStorage.removeItem('projects');
    updateProjectContainer();
});
deleteListsBtn.addEventListener('click', () => {
    listData.length = 0;
    localStorage.removeItem('lists');
    updateListContainer();
});