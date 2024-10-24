import { FaPlusCircle } from 'react-icons/fa';

export default function NewTask(props) {
  return (
    <div className='task new-task'>
      <div className='task-left'>
        <span
          className={`${
            props.addTaskData.priority === 'high'
              ? 'task-edit-circle-border'
              : ''
          } task-circle`}
          style={{ backgroundColor: '#f199ac' }}
          onClick={() =>
            props.setAddTaskData((prevData) => ({
              ...prevData,
              priority: 'high',
            }))
          }
        ></span>
        <span
          className={`${
            props.addTaskData.priority === 'medium'
              ? 'task-edit-circle-border'
              : ''
          } task-circle`}
          style={{ backgroundColor: '#eecd32' }}
          onClick={() =>
            props.setAddTaskData((prevData) => ({
              ...prevData,
              priority: 'medium',
            }))
          }
        ></span>
        <span
          className={`${
            props.addTaskData.priority === 'low'
              ? 'task-edit-circle-border'
              : ''
          } task-circle`}
          style={{ backgroundColor: '#70cff2' }}
          onClick={() =>
            props.setAddTaskData((prevData) => ({
              ...prevData,
              priority: 'low',
            }))
          }
        ></span>
        <input
          type='text'
          placeholder='Enter task name...'
          className='task-edit-input'
          value={props.addTaskData.name}
          onChange={(e) =>
            props.setAddTaskData((prevData) => ({
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
          value={props.addTaskData.date}
          onChange={(e) =>
            props.setAddTaskData((prevData) => ({
              ...prevData,
              date: e.target.value,
            }))
          }
        />
      </div>
      <FaPlusCircle className='task-edit-icon' onClick={props.addTask} />
    </div>
  );
}
