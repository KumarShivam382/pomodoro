import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
  MenuItem,
} from "@material-tailwind/react";

export default function ViewTodo() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", priority: "High", completed: false },
    { id: 2, title: "Task 2", priority: "Medium", completed: false },
    { id: 3, title: "Task 3", priority: "Low", completed: true },
    { id: 4, title: "Task 4", priority: "High", completed: false },
    { id: 5, title: "Task 5", priority: "Medium", completed: false },
  ]);

  const handleOpen = () => setOpen((cur) => !cur);

  const handleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRemove = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <>
      <Button onClick={handleOpen}>View Tasks</Button>
      <Dialog size="md" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <Typography variant="h5" color="blue-gray">
            Task List
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </IconButton>
        </DialogHeader>
        <DialogBody className="overflow-y-scroll !px-5">
          <div className="mt-3">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Priority</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className={
                      task.completed ? "line-through text-gray-500" : ""
                    }
                  >
                    <td className="py-2 px-4 border-b">{task.title}</td>
                    <td className="py-2 px-4 border-b">{task.priority}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <Button
                        size="sm"
                        variant={task.completed ? "outlined" : "filled"}
                        color={task.completed ? "red" : "green"}
                        onClick={() => handleComplete(task.id)}
                      >
                        {task.completed ? "Undo" : "Complete"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outlined"
                        color="red"
                        onClick={() => handleRemove(task.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogBody>
        <DialogFooter className="justify-between gap-2">
          <Typography variant="small" color="gray" className="font-normal">
            Task management made easy.
          </Typography>
        </DialogFooter>
      </Dialog>
    </>
  );
}
