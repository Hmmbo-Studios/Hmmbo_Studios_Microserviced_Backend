import { Request, Response } from 'express';
import projectService from '../services/projectService';

export const listProjects = async (req: Request, res: Response): Promise<void> => {
  const data = await projectService.getAll();
  res.json(data);
  return; // void
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  const project = await projectService.getById(req.params.id);
  if (!project) {
    res.status(404).json({ message: 'Not Found' });
    return; // stop here
  }
  res.json(project);
  return;
};

export const getProjectByTitle = async (req: Request, res: Response): Promise<void> => {
  const project = await projectService.getByTitle(req.params.title);
  if (!project) {
    res.status(404).json({ message: 'Not Found' });
    return; 
  }
  res.json(project);
  return;
};
