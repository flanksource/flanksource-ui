import fs from "node:fs";
import path from "node:path";
import { loadCreateSkillTool } from "./bash-tool";

type LoadedSkillTool = {
  skillTool?: unknown;
  skillFiles: Record<string, string>;
  skillInstructions?: string;
  skillsDir: string;
  skillsCount: number;
  error?: string;
};

const DEFAULT_SKILLS_DIR = path.join(
  process.cwd(),
  ".ai-skills",
  "claude-code-plugin",
  "skills"
);

const SKILLS_CACHE_TTL_MS = 5 * 60 * 1000;

let cache:
  | (LoadedSkillTool & {
      loadedAt: number;
    })
  | undefined;

function resolveSkillsDir() {
  const envDir = process.env.CHAT_SKILLS_DIR?.trim();

  if (envDir) {
    return path.isAbsolute(envDir)
      ? envDir
      : path.resolve(process.cwd(), envDir);
  }

  return DEFAULT_SKILLS_DIR;
}

export async function loadSkillTool(): Promise<LoadedSkillTool> {
  const skillsDir = resolveSkillsDir();

  if (
    cache &&
    cache.skillsDir === skillsDir &&
    Date.now() - cache.loadedAt < SKILLS_CACHE_TTL_MS
  ) {
    return cache;
  }

  if (!fs.existsSync(skillsDir)) {
    const result: LoadedSkillTool = {
      skillFiles: {},
      skillsDir,
      skillsCount: 0
    };

    cache = {
      ...result,
      loadedAt: Date.now()
    };

    return result;
  }

  try {
    const createSkillTool = await loadCreateSkillTool();
    const { skill, skills, files, instructions } = await createSkillTool({
      skillsDirectory: skillsDir
    });

    const result: LoadedSkillTool = {
      skillTool: skill,
      skillFiles: files,
      skillInstructions: instructions,
      skillsDir,
      skillsCount: skills.length
    };

    cache = {
      ...result,
      loadedAt: Date.now()
    };

    return result;
  } catch (error) {
    const result: LoadedSkillTool = {
      skillFiles: {},
      skillsDir,
      skillsCount: 0,
      error: error instanceof Error ? error.message : String(error)
    };

    cache = {
      ...result,
      loadedAt: Date.now()
    };

    return result;
  }
}
