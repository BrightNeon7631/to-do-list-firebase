import { MdCheckCircle } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';

export default function Task(props) {
  return (
    <div className={`${props.task.completed ? 'task-completed' : ''} task`}>
      {props.editTaskData?.id !== props.task.id ? (
        <>
          <span
            className='task-circle'
            style={
              props.task.priority === 'high'
                ? { backgroundColor: '#f199ac' }
                : props.task.priority === 'medium'
                ? { backgroundColor: '#eecd32' }
                : { backgroundColor: '#70cff2' }
            }
          ></span>
          <div className='task-left'>
            <div>
              <div
                className='task-name'
                onClick={() => props.toggleEditTask(props.task)}
              >
                {props.task.name}
              </div>
              {props.task.completedAt && props.task.completedAt !== false ? (
                <div>{props.task.completedAt}</div>
              ) : null}
            </div>
          </div>
          <div className='task-right'>
            <div onClick={() => props.toggleEditTask(props.task)}>
              {props.task.date}
            </div>
            <div
              onClick={() =>
                props.updateTaskCompleted(props.task.id, props.task.completed)
              }
            >
              {!props.task.completed ? (
                <div className='task-complete-circle'></div>
              ) : (
                <FaCheckCircle />
              )}
            </div>
          </div>
        </>
      ) : props.editTaskData?.id === props.task.id ? (
        <>
          <div className='task-left'>
            <span
              className={`${
                props.editTaskData.priority === 'high'
                  ? 'task-edit-circle-border'
                  : ''
              } task-circle`}
              style={{ backgroundColor: '#f199ac' }}
              onClick={() =>
                props.setEditTaskData((prevData) => ({
                  ...prevData,
                  priority: 'high',
                }))
              }
            ></span>
            <span
              className={`${
                props.editTaskData.priority === 'medium'
                  ? 'task-edit-circle-border'
                  : ''
              } task-circle`}
              style={{ backgroundColor: '#eecd32' }}
              onClick={() =>
                props.setEditTaskData((prevData) => ({
                  ...prevData,
                  priority: 'medium',
                }))
              }
            ></span>
            <span
              className={`${
                props.editTaskData.priority === 'low'
                  ? 'task-edit-circle-border'
                  : ''
              } task-circle`}
              style={{ backgroundColor: '#70cff2' }}
              onClick={() =>
                props.setEditTaskData((prevData) => ({
                  ...prevData,
                  priority: 'low',
                }))
              }
            ></span>
            <input
              className='task-edit-input'
              type='text'
              value={props.editTaskData.name}
              onChange={(e) =>
                props.setEditTaskData((prevData) => ({
                  ...prevData,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className='task-right'>
            <input
              type='date'
              className='task-edit-input'
              value={props.editTaskData.date}
              onChange={(e) =>
                props.setEditTaskData((prevData) => ({
                  ...prevData,
                  date: e.target.value,
                }))
              }
            />
          </div>
          <MdCheckCircle
            className='task-edit-icon'
            onClick={() => props.updateEditTask(props.task)}
          />
          <MdCancel className='task-edit-icon' onClick={props.cancelEditTask} />
        </>
      ) : null}
    </div>
  );
}
