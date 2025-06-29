import { Schema, model } from "mongoose";
import { Project } from "./IProject";

const UpdateSchema = new Schema<Project["updates"][0]>({
  id: String,
  title: String,
  description: [String],
  acknowledgement: String,
  githubLink: String,
  author: { username: String, avatarUrl: String },
  timestamp: Date,
});
const CommentSchema = new Schema<Project["comments"][0]>({
  id: String,
  profileImage: String,
  username: String,
  comment: String,
  rating: String,
});
const BuildSchema = new Schema<Project["versions"][0]["builds"][0]>({
  buildId: String,
  projectVersion: String,
  githubLink: String,
  downloadLink: String,
  releaseDate: Date,
  isLatest: Boolean,
  isDeprecated: Boolean,
});
const VersionSchema = new Schema<Project["versions"][0]>({
  mcVersion: String,
  builds: [BuildSchema],
});
const InfoSchema = new Schema<Project["projectInfo"]>({
  author: String,
  totalDownloads: Number,
  firstRelease: Date,
  lastUpdate: Date,
  status: String,
  rating: String,
  totalRatings: Number,
});

const ProjectSchema = new Schema<Project>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discordLink: String,
    donationLink: String,
    description: String,
    image_url: String,
    category: String,
    updates: [UpdateSchema],
    comments: [CommentSchema],
    versions: [VersionSchema],
    projectInfo: InfoSchema,
  },
  { timestamps: true }
);

export const ProjectModel = model<Project>("Project", ProjectSchema);
