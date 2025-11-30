import { z } from "zod";
import { tool } from "@langchain/core/tools";
import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api";

export const tools = [
  tool(
    async ({ taskName, taskStatus }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/task`, {
          title: taskName,
          description: "",
          status: taskStatus
        });
        return response.data.data;
      } catch (error) {
        console.error('Error creating task:', error);
        throw error;
      }
    },
    {
      name: "createTask",
      description: "สร้าง task ใหม่",
      schema: z.object({
        taskName: z.string(),
        taskStatus: z.string()
      })
    }
  ),
  tool(
    async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/listAllTask`);
        return response.data.data;
      } catch (error) {
        console.error('Error getting all tasks:', error);
        throw error;
      }
    },
    {
      name: "getAllTasks",
      description: "ดึงรายการงานทั้งหมด",
      schema: z.object({})
    }
  ),
  tool(
    async ({ id }) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/task/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error getting task by ID:', error);
        throw error;
      }
    },
    {
      name: "getTaskById",
      description: "ดึงงานจาก ID",
      schema: z.object({
        id: z.number()
      })
    }
  ),
  tool(
    async ({ id, taskName, taskStatus }) => {
      try {
        const response = await axios.put(`${API_BASE_URL}/task/${id}`, {
          title: taskName,
          description: "",
          status: taskStatus
        });
        return response.data.data;
      } catch (error) {
        console.error('Error updating task:', error);
        throw error;
      }
    },
    {
      name: "updateTask",
      description: "อัปเดตงาน",
      schema: z.object({
        id: z.number(),
        taskName: z.string(),
        taskStatus: z.string()
      })
    }
  ),
  tool(
    async ({ id }) => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/task/${id}`);
        return response.data.data;
      } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    },
    {
      name: "deleteTask",
      description: "ลบงาน",
      schema: z.object({
        id: z.number()
      })
    }
  )
];
