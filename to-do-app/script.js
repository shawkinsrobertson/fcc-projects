

// form and containers
const taskForm = document.getElementById('task-form');
const projectForm = document.getElementById('project-form');
const listForm = document.getElementById('list-form');
const tasksContainer = document.getElementById('tasks-container');
const sidebar = document.querySelector('.menu-sidebar');
const tasks = document.querySelectorAll('.task');
const projectContainer = document.getElementById('project-container');
const listContainer = document.getElementById('list-container');
const projectDashboard = document.getElementById('project-dashboard');
const listDashboard = document.getElementById('list-dashboard');
const projectTaskList = projectDashboard.querySelector('.filtered-task-list');
const listTaskList = listDashboard.querySelector('.filtered-task-list');


//buttons
const openTaskFormBtn = document.getElementById('open-task-form-btn');
const closeTaskFormBtn = document.getElementById('close-task-form-btn');
const addOrUpdateTaskBtn = document.getElementById('add-or-update-task-btn');
const addOrUpdateProjectBtn = document.getElementById('add-or-update-project-btn');
const addOrUpdateListBtn = document.getElementById('add-or-update-list-btn');
const cancelBtn = document.getElementById('cancel-btn');
const deleteProjectsBtn = document.getElementById('delete-projects-btn');
const deleteListsBtn = document.getElementById('delete-lists-btn');
const editProjectBtn = document.getElementById('edit-project-btn');
const editListBtn = document.getElementById('edit-list-btn');

//inputs and dialog
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

//data and storage
const taskData = JSON.parse(localStorage.getItem('tasks')) || [];
const projectData = JSON.parse(localStorage.getItem('projects')) || [];
const listData = JSON.parse(localStorage.getItem('lists')) || [];
let currentTask = {};
let currentProject = {};
let currentlist = {};

//functions
// const removeSpecialChars = (str) => {
//     const cleanStr = str.replace(/[^a-zA-Z0-9 ]/g, '');
//     return cleanStr;
// }

const reset = () => {
    addOrUpdateTaskBtn.innerText = 'Add Task';
    titleInput.value = '';
    dateInput.value = '';
    projectInput.value = '';
    listInput.value = '';
    descriptionInput.value   = '';
    currentTask = {}; 

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

const deleteProject = () => {
    const projectIndex = projectData.findIndex(project => project.id === currentProject.id);
    if(projectIndex === -1) {
        alert(`This project doesn't exist. Are you looking for a different project?`);
        return;
    } else {
        projectData.splice(projectIndex, 1);
    };
    localStorage.setItem('projects', JSON.stringify(projectData));
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

const deleteList = () => {
    const listIndex = listData.findIndex(list => list.id === currentList.id);
    if(listIndex === -1) {
        alert(`This list doesn't exist. Are you looking for a different list?`);
        return;
    } else {
        listData.splice(listIndex, 1);
    };
    localStorage.setItem('lists', JSON.stringify(listData));
};


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
    reset();
};

addOrUpdateProject = () => {};
addOrUpdateList = () => {};

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

}

const updateTaskContainer = () => {
    tasksContainer.innerHTML = '';
    taskData.forEach(({id, title, date, project, list, description}) => {
        const formattedDate = date.split('-').reverse().join('-').replaceAll('-', '/');
        tasksContainer.innerHTML += `
        <div class='task' id='${id}'>
            <p><strong>Title:</strong>${title}</p>
            <p><strong>Date:</strong>${formattedDate}</p>
            ${project ? `<p><strong>${project}</strong></p` : ''}
            ${list ? `<p><strong>${list}</strong></p` : ''}
            <p><strong>Description:</strong>${description}</p>
                <div class='form-btn-div'>
                <button type='button' class='btn' onclick =editTask(this)>Edit</button>
                <button type='button' class='btn' onclick =deleteTask(this)>Delete</button>
            </div>
        </div>
    `})
};

const updateProjectContainer = () => {
     projectContainer.innerHTML = '';
    projectData.forEach(({title}) => projectContainer.innerHTML += `
        <div class='project' id='${title}'>
            <p class='project-title'>${title}</p>
        </div>
    `)
};
const updateListContainer = () => {
     listContainer.innerHTML = '';
    listData.forEach(({id, title}) => listContainer.innerHTML += `
        <div class='list' id='${title}'>
            <p class='list-title'>${title}</p>
        </div>
    `)
};

const renderProject = (e) => {
    tasksContainer.innerHTML = '';
    projectTaskList.innerHTML = '';
    listDashboard.style.display = 'none';
    const projectElement = e.target.closest('.project'); 
    const tasksToRender = taskData.filter(tasks => tasks.project === projectElement.id);
    projectDashboard.style.display = 'flex';
    projectDashboard.dataset.project = 'project';
    projectTitle.innerHTML = projectElement.id;
   tasksToRender.forEach(({id, title, date, project, list, description}) => {
        const formattedDate = date.split('-').reverse().join('-').replaceAll('-', '/');
        projectTaskList.innerHTML += `<div class='task' id='${id}'>
            <p><strong>Title:</strong>${title}</p>
            <p><strong>Date:</strong>${formattedDate}</p>
            ${project ? `<p><strong>${project}</strong></p` : ''}
            ${list ? `<p><strong>${list}</strong></p` : ''}
            <p><strong>Description:</strong>${description}</p>
            <div class='form-btn-div'>
                <button type='button' class='btn' onclick =editTask(this)>Edit</button>
                <button type='button' class='btn' onclick =deleteTask(this)>Delete</button>
            </div>
        </div>`
    })  
};

const renderList = (e) => {
   tasksContainer.innerHTML = '';
   listTaskList.innerHTML = '';
   projectDashboard.style.display = 'none';
    const listElement = e.target.closest('.list');
    listDashboard.style.display = 'flex';
    listTitle.innerHTML = listElement.id;
    const tasksToRender = taskData.filter(tasks => tasks.list === listElement.id);
   tasksToRender.forEach(({id, title, date, project, list, description}) => {
        const formattedDate = date.split('-').reverse().join('-').replaceAll('-', '/');
        listTaskList.innerHTML += `<div class='task' id='${id}'>
            <p><strong>Title:</strong>${title}</p>
            <p><strong>Date:</strong>${formattedDate}</p>
            ${project ? `<p><strong>${project}</strong></p` : ''}
            ${list ? `<p><strong>${list}</strong></p` : ''}
            <p><strong>Description:</strong>${description}</p>
               <div class='form-btn-div'>
                <button type='button' class='btn' onclick =editTask(this)>Edit</button>
                <button type='button' class='btn' onclick =deleteList(this)>Delete</button>
            </div>
        </div>`
    })  

};

if(taskData.length) {
    updateTaskContainer();
}
if(projectData.length) {
    updateProjectContainer();
}
if(listData.length) {
    updateListContainer();
}

//event listeners
openTaskFormBtn.addEventListener('click', () => {taskForm.classList.toggle('hidden')});
closeTaskFormBtn.addEventListener('click', () => {
    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;
    if(titleInput.value || dateInput.value || descriptionInput.value && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        taskForm.classList.toggle('hidden')
        reset();
    }
});
cancelBtn.addEventListener('click', () => {confirmCloseDialog.close()});
discardBtn.addEventListener('click', () => {
    confirmCloseDialog.close()
    reset();
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



//expand/collapse sidebar on click, change logo/hamburger menu/close icon display
// sidebar.addEventListener('click',)

// listen for key input on project and list inputs, search current projects/lists, create new if no matching entries