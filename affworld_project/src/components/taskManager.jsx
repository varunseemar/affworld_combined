import React,{ useState, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './taskManager.module.css'
import trash from '../images/trash.png'
import { fetchUserTasks } from '../services/taskManagement'
import { updateTaskStatus } from '../services/taskManagement'

const TaskItem =({ task, onDelete, onStatusChange })=>{
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item:{ id: task._id, status: task.status },
        collect:(monitor)=>({
            isDragging: !!monitor.isDragging(),
        }),
    });
    const handleDelete =()=>{
        onDelete(task._id);
    };
    return(
        <div ref={drag} className={styles.taskmaindiv} style={{ opacity: isDragging ? 0.8 : 1 , cursor: isDragging ? 'grabbing' : 'grab' }}>
            <div className={styles.taskmaindivtitle}>
                <p>{task.title}</p>
                <img src={trash} onClick={handleDelete} alt="Delete task" />
            </div>
            <div className={styles.taskmaindivdescription}>
                <p className={styles.taskmaindivdescriptiontext}>Description:</p>
                <p className={styles.taskmaindivdescriptiontextvalue}>{task.description}</p>
            </div>
        </div>
    );
};

const TaskColumn =({ status, tasks, onDelete, onStatusChange })=>{
    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: async(item)=>{
            if(item.status !== status){
                await onStatusChange(item.id, status);
            }
        },
        collect:(monitor)=>({
            isOver: !!monitor.isOver(),
        }),
    });
    return(
        <div ref={drop} className={`${status === 'pending' ? styles.taskpendingdiv : status === 'todo' ? styles.tasktododiv : styles.taskcompleteddiv}`}style={{ backgroundColor: isOver ? '#e0e0e0' : '#EEF2F5' }}>
            <div className={styles.uppernames}>
                <p>{status.charAt(0).toUpperCase()+ status.slice(1)}</p>
            </div>
            <div className={`${status === 'pending' ? styles.tasklistpending : status === 'todo' ? styles.tasklisttodo : styles.tasklistcompleted}`}>
                {tasks.map((task)=>(
                    <TaskItem key={task._id} task={task} onDelete={onDelete} onStatusChange={onStatusChange}/>
                ))}
            </div>
        </div>
    );
};

const TaskManager =({ openAddTaskModal, openDeleteModal, setDeleteTaskId, refresh })=>{
    const [tasks, setTasks] = useState([]);
    const fetchTasks = async()=>{
        let email = localStorage.getItem('email');
        const response = await fetchUserTasks({ email });
        setTasks(response);
    };
    const handleDeleteTask = async(id)=>{
        setDeleteTaskId(id);
        openDeleteModal();
    };
    const handleStatusChange = async(taskId, newStatus)=>{
        try{
            await updateTaskStatus({ taskId, newStatus });
            await fetchTasks();
        } 
        catch(error){
            console.error('Failed to update task status', error);
        }
    };
    useEffect(()=>{
        fetchTasks();
    }, [refresh]);
    const handleClickAddTask =()=>{
        openAddTaskModal();
    };
    return(
        <DndProvider backend={HTML5Backend}>
            <div className={styles.taskmanagerMain}>
                <div className={styles.addtask}>
                    <button onClick={handleClickAddTask}>Add Task</button>
                </div>
                <div className={styles.taskdiv}>
                    <TaskColumn status="pending" tasks={tasks.filter(task => task.status === 'pending')} onDelete={handleDeleteTask} onStatusChange={handleStatusChange}/>
                    <TaskColumn status="todo" tasks={tasks.filter(task => task.status === 'todo')} onDelete={handleDeleteTask} onStatusChange={handleStatusChange}/>
                    <TaskColumn status="completed" tasks={tasks.filter(task => task.status === 'completed')} onDelete={handleDeleteTask} onStatusChange={handleStatusChange}/>
                </div>
            </div>
        </DndProvider>
    );
};

export default TaskManager;