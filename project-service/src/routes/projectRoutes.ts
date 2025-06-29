import { Router } from "express";
import {
  listProjects,
  getProjectById,
  getProjectByTitle,
} from "../controllers/projectController";

const router = Router();
router.get("/", listProjects);
router.get("/id/:id", getProjectById);
router.get("/title/:title", getProjectByTitle);
export default router;
