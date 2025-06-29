// TYPES
export type Rating = "1" | "2" | "3" | "4" | "5";

export interface Update {
  id: string;
  title: string;
  description: string[];
  acknowledgement?: string;
  githubLink?: string;
  author: { username: string; avatarUrl: string };
  timestamp: Date;
}
export interface Comment {
  id: string;
  profileImage: string;
  username: string;
  comment: string;
  rating: Rating;
}
export interface Build {
  buildId: string;
  projectVersion: string;
  githubLink: string;
  downloadLink: string;
  releaseDate: Date;
  isLatest?: boolean;
  isDeprecated?: boolean;
}
export interface Version {
  mcVersion: string;
  builds: Build[];
}
export interface ProjectInfo {
  author: string;
  totalDownloads: number;
  firstRelease: Date;
  lastUpdate: Date;
  status: "Basic" | "Standard" | "Premium";
  rating: Rating;
  totalRatings: number;
}
export interface Project {
  id: string;
  title: string;
  price: number;
  discordLink: string;
  donationLink: string;
  description: string;
  image_url: string;
  category: string;
  updates: Update[];
  comments: Comment[];
  versions: Version[];
  projectInfo: ProjectInfo;
}
