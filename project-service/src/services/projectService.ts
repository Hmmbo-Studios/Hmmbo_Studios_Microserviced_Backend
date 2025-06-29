import { ProjectModel } from "../models/Project";
import { Project } from "../models/IProject";

export class ProjectService {
  async getAll(): Promise<Project[]> {
    return ProjectModel.find().lean();
  }
  async getById(id: string): Promise<Project | null> {
    return ProjectModel.findOne({ id }).lean();
  }
  async getByTitle(title: string): Promise<Project | null> {
    return ProjectModel.findOne({ title }).lean();
  }
}
export default new ProjectService();
