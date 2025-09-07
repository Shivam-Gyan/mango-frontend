"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/context/page";
import Sidebar from "@/components/sidebar.component";
import { updateTask, deleteTask, createTask } from "@/services/task.services";
import { getProfile } from "@/services/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import { DialogOverlay, DialogPortal } from "@radix-ui/react-dialog";

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useProfile();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "DONE">("ALL");

  // Create Task state
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Edit Task state
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch tasks on load
  useEffect(() => {
    (async () => {
      try {
        const res = await getProfile();
        setTasks(res.user.tasks || []);
        setFilteredTasks(res.user.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    })();
  }, []);

  // Handle search + filter
  useEffect(() => {
    let temp = [...tasks];
    if (search) temp = temp.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    if (filter === "PENDING") temp = temp.filter((t) => !t.completed);
    else if (filter === "DONE") temp = temp.filter((t) => t.completed);
    setFilteredTasks(temp);
  }, [search, filter, tasks]);

  // Toggle completion
  const toggleTask = async (taskId: string, currentState: boolean) => {
    try {
      const { task } = await updateTask(taskId, { completed: !currentState });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      toast.success("Task updated!");
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task
  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Add task
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const res = await createTask({ ...newTask, completed: false });
      setTasks((prev) => [res.task, ...prev]);
      setNewTask({ title: "", description: "" });
      toast.success("Task created successfully!");
      setIsCreateDialogOpen(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // Open edit modal
  const handleOpenEditModal = (task: Task) => {
    setEditTaskData(task);
    setIsEditDialogOpen(true);
  };

  // Save edited task
  const handleEditTask = async () => {
    if (!editTaskData?.title.trim()) return;
    try {
      const { task } = await updateTask(editTaskData._id, {
        title: editTaskData.title,
        description: editTaskData.description,
      });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      toast.success("Task edited successfully!");
      setIsEditDialogOpen(false);
      setEditTaskData(null);
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Main Content */}
      <div className="flex-1 py-8 ml-0 overflow-y-scroll scroll-smooth h-screen p-6 space-y-6 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="bg-none mt-2 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className={`fi fi-rr-angle-double-${sidebarOpen ? "" : "right"}`}></i>
          </div>
          <h1 className="text-2xl font-bold">Task Dashboard</h1>

          {/* Create Task Modal */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-1" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="create-task-description">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription id="create-task-description">
                  Fill out the task title and description
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                />
                <Button className="w-full" onClick={handleAddTask}>
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 items-center mb-4">
          <Input
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {filter === "ALL" ? "All" : filter === "PENDING" ? "Pending" : "Done"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("ALL")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("PENDING")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("DONE")}>Done</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <Card
              key={task._id}
              className={`transition-all shadow-md rounded-2xl ${task.completed ? "border-green-400 bg-green-50" : "border-yellow-300 bg-yellow-50"
                }`}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {task.title}
                  <div className="flex items-center gap-2">
                    <Switch checked={task.completed} onCheckedChange={() => toggleTask(task._id, task.completed)} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleOpenEditModal(task)}>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(task._id)}>Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <p className="mt-2 text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && <p className="text-center text-muted-foreground">No tasks found.</p>}

        {/* Edit Task Modal */}
        {/* Edit Task Modal */}
        {isEditDialogOpen && editTaskData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditTaskData(null);
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              {/* Modal Header */}
              <h2 className="text-xl font-semibold mb-2">Edit Task</h2>
              <p className="text-sm text-gray-500 mb-4">
                Update the task title and description below
              </p>

              {/* Modal Form */}
              <div className="space-y-4">
                <Input
                  placeholder="Task title"
                  value={editTaskData.title}
                  onChange={(e) =>
                    setEditTaskData((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                />
                <Textarea
                  placeholder="Task description"
                  value={editTaskData.description}
                  onChange={(e) =>
                    setEditTaskData((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                />
                <Button className="w-full" onClick={handleEditTask}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}



      </div>
    </div>
  );
}
