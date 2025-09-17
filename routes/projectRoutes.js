import express from "express";
import {
  addProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();
// router.post("/", addProject);
router.post("/", upload.array("images", 10), addProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);
router.put("/:id", updateProject);

export default router;
