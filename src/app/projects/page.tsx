import type { Metadata } from "next";
import { ProjectBoard } from "@/components/project-board";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <ProjectBoard />;
}
