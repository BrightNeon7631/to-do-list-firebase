import { 
  useEffect, 
  useState, 
  useContext 
} from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { 
  FaElementor, 
  FaDotCircle 
} from 'react-icons/fa';
import { db } from '../firebase';
import { format } from 'date-fns';
import { GrTasks } from 'react-icons/gr';
import { SiGoogletasks } from 'react-icons/si';
import { FaCirclePlus } from 'react-icons/fa6';
import avatar from '../assets/images/defaultAvatar.jpg';
import { useUserAuth } from '../context/UserAuthContext';
import Task from '../components/Task';
import NewTask from '../components/NewTask';
import ProjectsDesktopOrMobile from '../components/ProjectsDesktopOrMobile';
import { HamburgerContext } from '../components/Layout';

export default function ProjectsTasks() {
  const { user } = useUserAuth();
  const { menuOpenState } = useContext(HamburgerContext);

  const [projectsLoading, setProjectsLoading] = useState(true);
  const [addProjectInput, setAddProjectInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [projectID, setProjectID] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [addTaskData, setAddTaskData] = useState({
    name: '',
    priority: 'medium',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [tasks, setTasks] = useState([]);
  const [editTaskData, setEditTaskData] = useState(null);

  console.log(projects, tasks);
  
  // selects 'all tasks' option on site load
  const [tasksFilter, setTasksFilter] = useState({
    all: true,
    today: false,
    completed: false,
  });

  const tasksForToday =
    tasks.length > 0
      ? tasks.filter(
          (task) =>
            task.date == format(new Date(), 'yyyy-MM-dd') && !task.completed
        )
      : [];
  const completedTasks = tasks.length > 0 ? tasks.filter((task) => task.completed) : [];
  const allTasks = tasks.length > 0 ? tasks.filter((task) => !task.completed) : [];

  // hides the scrollbar when hamburger menu is open
  useEffect(() => {
    const element = document.getElementsByTagName('body')[0];
    if (menuOpenState === true) {
      element.style.overflowY = 'hidden';
    } else {
      element.style.overflowY = 'scroll';
    }
  }, [menuOpenState]);

  useEffect(() => {
    setProjectsLoading(true);
    const projectsCollection = query(
      collection(db, 'users', user.uid, 'projects'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(projectsCollection, (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProjects(projectsData);
      setProjectsLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    setTasksLoading(true);
    const tasksCollection = query(
      collection(db, 'users', user.uid, 'tasks'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(tasksCollection, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTasks(tasksData);
      setTasksLoading(false);
    });

    return () => unsub();
  }, []);

  const getCurrentTasks = () => {
    if (tasks.length > 0) {
      if (tasksFilter.all) {
        return allTasks;
      } else if (tasksFilter.today) {
        return tasksForToday;
      } else if (tasksFilter.completed) {
        return completedTasks;
      } else if (projectID) {
        return tasks.filter((task) => task.projectID === projectID);
      }
    } else {
      return [];
    }
  };

  const currentTasks = getCurrentTasks();

  function filterTasks(option) {
    setProjectID(null);
    if (option === 'today') {
      setTasksFilter({ all: false, today: true, completed: false });
    } else if (option === 'all') {
      setTasksFilter({ all: true, today: false, completed: false });
    } else if (option === 'completed') {
      setTasksFilter({ all: false, today: false, completed: true });
    }
  }

  async function addProject() {
    if (!addProjectInput.startsWith(' ') && addProjectInput !== '') {
      const projectsCollection = collection(db, 'users', user.uid, 'projects');
      const docRef = await addDoc(projectsCollection, {
        name: addProjectInput,
        createdAt: new Date(),
      });
      selectProject(docRef.id);
    }
    setAddProjectInput('');
  }

  function selectProject(id) {
    setTasksFilter({ all: false, today: false, completed: false });
    setProjectID(id);
  }

  async function addTask() {
    if (!addTaskData.name.startsWith(' ') && addTaskData.name !== '') {
      const tasksCollection = collection(db, 'users', user.uid, 'tasks');
      await addDoc(tasksCollection, {
        projectID: projectID,
        name: addTaskData.name,
        priority: addTaskData.priority,
        completed: false,
        date: format(addTaskData.date, 'yyyy-MM-dd'),
        createdAt: new Date(),
        completedAt: false,
      });
    }
    setAddTaskData({
      name: '',
      priority: 'medium',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  }

  async function updateTaskCompleted(taskID, currentCompleted) {
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskID);
    await updateDoc(taskDocRef, {
      completed: !currentCompleted,
      completedAt:
        currentCompleted === false
          ? format(new Date(), 'yyyy-MM-dd HH:mm')
          : false,
    });
  }

  function toggleEditTask(task) {
    setEditTaskData({
      id: task.id,
      name: task.name,
      priority: task.priority,
      date: task.date,
    });
  }

  function cancelEditTask() {
    setEditTaskData(null);
  }

  async function updateEditTask(task) {
    if (
      (task.name !== editTaskData.name ||
        task.priority !== editTaskData.priority ||
        task.date !== editTaskData.date) &&
      !editTaskData.name.startsWith(' ') &&
      editTaskData.name !== '' &&
      editTaskData.date !== ''
    ) {
      const taskDocRef = doc(db, 'users', user.uid, 'tasks', task.id);
      await updateDoc(taskDocRef, {
        name: editTaskData.name,
        priority: editTaskData.priority,
        date: format(editTaskData.date, 'yyyy-MM-dd'),
      });
    }
    setEditTaskData(null);
  }

  async function removeCompletedTasks() {
    const completed = currentTasks.filter((task) => task.completed === true);
    completed.forEach(async (task) => {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', task.id));
    });
  }

  async function removeProject() {
    const projectIDCopy = projectID;
    // gets the nearest project whose ID is different from the one that's about to be deleted
    const nextProject = projects.find((project) => project.id !== projectID);

    await deleteDoc(doc(db, 'users', user.uid, 'projects', projectID));
    if (projects.length > 1) {
      // or nextProject is not undefined
      setProjectID(nextProject.id);
    } else {
      setTasksFilter({ all: true, today: false, completed: false });
      setProjectID(null);
    }
    // removes the deleted project's tasks
    const tasksToDelete = tasks.filter(
      (task) => task.projectID === projectIDCopy
    );
    tasksToDelete.forEach(async (task) => {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', task.id));
    });
  }

  const renderProjects = projects.map((project) => {
    const uncompletedTasksLength = tasks.filter(
      (task) => task.projectID === project.id && task.completed === false
    ).length;
    return (
      <div
        key={project.id}
        onClick={() => selectProject(project.id)}
        className={`${
          project.id === projectID ? 'active-project' : ''
        }  projects-tasks-left-top-el`}
      >
        <FaElementor />
        <span>{project.name}</span>
        {uncompletedTasksLength > 0 ? (
          <span className='circle'>
            {tasks.length > 0 ? uncompletedTasksLength : null}
          </span>
        ) : null}
      </div>
    );
  });

  const renderTasks = currentTasks.map((task) => {
    return (
      <Task
        key={task.id}
        task={task}
        updateTaskCompleted={updateTaskCompleted}
        editTaskData={editTaskData}
        setEditTaskData={setEditTaskData}
        updateEditTask={updateEditTask}
        cancelEditTask={cancelEditTask}
        toggleEditTask={toggleEditTask}
      />
    );
  });

  return (
    <div className='projects-tasks'>
      <ProjectsDesktopOrMobile>
        <div className='projects-tasks-left'>
          <div className='projects-tasks-left-user'>
            <img src={avatar} alt='avatar' />
            <div className='projects-tasks-left-user-info'>
              <div>Just Do It!</div>
              <div>{user.email}</div>
            </div>
          </div>
          <hr></hr>
          <div className='projects-tasks-left-top'>
            <div
              className={`${
                tasksFilter.today ? 'active-project' : ''
              } projects-tasks-left-top-el`}
            >
              <FaDotCircle />
              <span onClick={() => filterTasks('today')}>Tasks for today</span>
              {tasksForToday.length > 0 ? (
                <span className='circle'>{tasksForToday.length}</span>
              ) : null}
            </div>
            <div
              className={`${
                tasksFilter.all ? 'active-project' : ''
              } projects-tasks-left-top-el`}
            >
              <GrTasks />
              <span onClick={() => filterTasks('all')}>All tasks</span>
              {allTasks.length > 0 ? (
                <span className='circle'>{allTasks.length}</span>
              ) : null}
            </div>
            <div
              className={`${
                tasksFilter.completed ? 'active-project' : ''
              } projects-tasks-left-top-el`}
            >
              <SiGoogletasks />
              <span onClick={() => filterTasks('completed')}>
                Completed tasks
              </span>
              {completedTasks.length ? (
                <span className='circle'>{completedTasks.length}</span>
              ) : null}
            </div>
          </div>
          <div className='projects projects-tasks-left-top'>
            <h2>Projects</h2>
            {!projectsLoading ? (
              <>
                {renderProjects}
                <div className='project-add'>
                  <input
                    type='text'
                    value={addProjectInput}
                    onChange={(e) => setAddProjectInput(e.target.value)}
                    placeholder='Enter project name...'
                  />
                  <FaCirclePlus onClick={addProject} />
                </div>
              </>
            ) : (
              <div>Loading projects...</div>
            )}
          </div>
        </div>
      </ProjectsDesktopOrMobile>
      <div className='projects-tasks-right'>
        <div className='projects-tasks-right-top'>
          <h2>Tasks</h2>
          <div className='tasks-buttons'>
            {tasksFilter.completed || projectID ? (
              <button onClick={removeCompletedTasks}>Delete completed</button>
            ) : null}
            {projectID ? (
              <button onClick={removeProject}>Delete project</button>
            ) : null}
          </div>
        </div>
        {/* checks if at least one object value is equal to true */}
        {(projectID !== null && tasksLoading === false) ||
        (Object.values(tasksFilter).some((val) => val === true) &&
          tasksLoading === false) ? (
          <>
            {projectID !== null ? (
              <NewTask
                addTaskData={addTaskData}
                setAddTaskData={setAddTaskData}
                addTask={addTask}
              />
            ) : null}
            <div className='rendered-tasks'>{renderTasks}</div>
          </>
        ) : tasksLoading === true ? (
          <div>Loading tasks...</div>
        ) : null}
      </div>
    </div>
  );
}
