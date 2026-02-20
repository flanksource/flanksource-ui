/**
 * Why this file exists
 * --------------------
 * We intentionally load `bash-tool` and `just-bash` via dynamic import
 * (`import(/* webpackIgnore: true *\/ "...")`) instead of top-level imports.
 *
 * In this Next.js app route, regular package-level imports caused webpack to
 * traverse `just-bash` internals and fail on optional native / worker assets
 * during build.
 *
 * Error snippet from `npm run build` with regular imports:
 *
 *   ./node_modules/@mongodb-js/zstd/build/Release/zstd.node
 *   Module parse failed: Unexpected character '�' (1:0)
 *
 *   ./node_modules/just-bash/dist/bundle/chunks/chunk-VZWXH2PZ.js
 *   Module not found: Can't resolve 'node-liblzma'
 *
 *   static/media/worker.0f216b78.js from Terser
 *   x 'import', and 'export' cannot be used outside of module code
 *
 * Using runtime lazy imports here prevents that bundling path and keeps the
 * chat API build stable.
 */
type BashToolCommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

export type BashToolSandbox = {
  exec: (command: string) => Promise<BashToolCommandResult>;
  fs: {
    readFile: (path: string) => Promise<string>;
    writeFile: (path: string, content: string) => Promise<void>;
  };
};

export type CreateBashToolFn = (options?: {
  files?: Record<string, string>;
  destination?: string;
  sandbox?: BashToolSandbox;
  extraInstructions?: string;
}) => Promise<{
  tools: {
    bash: unknown;
    readFile: unknown;
    writeFile: unknown;
  };
}>;

export type CreateSkillToolFn = (options: {
  skillsDirectory: string;
}) => Promise<{
  skill: unknown;
  skills: unknown[];
  files: Record<string, string>;
  instructions: string;
}>;

export type JustBashConstructor = new (options?: {
  cwd?: string;
  files?: Record<string, string>;
  network?: {
    dangerouslyAllowFullInternetAccess?: boolean;
    timeoutMs?: number;
    maxRedirects?: number;
    maxResponseSize?: number;
  };
}) => BashToolSandbox;

let bashToolModulePromise: Promise<Record<string, unknown>> | undefined;
let justBashModulePromise: Promise<Record<string, unknown>> | undefined;

async function loadBashToolModule(): Promise<Record<string, unknown>> {
  if (!bashToolModulePromise) {
    bashToolModulePromise = import(
      /* webpackIgnore: true */ "bash-tool"
    ) as Promise<Record<string, unknown>>;
  }

  return bashToolModulePromise;
}

async function loadJustBashModule(): Promise<Record<string, unknown>> {
  if (!justBashModulePromise) {
    justBashModulePromise = import(
      /* webpackIgnore: true */ "just-bash"
    ) as Promise<Record<string, unknown>>;
  }

  return justBashModulePromise;
}

export async function loadCreateBashTool(): Promise<CreateBashToolFn> {
  const loadedModule = await loadBashToolModule();
  const createBashTool = loadedModule.createBashTool;

  if (typeof createBashTool !== "function") {
    throw new Error("bash-tool createBashTool export not found");
  }

  return createBashTool as CreateBashToolFn;
}

export async function loadCreateSkillTool(): Promise<CreateSkillToolFn> {
  const loadedModule = await loadBashToolModule();
  const createSkillTool = loadedModule.experimental_createSkillTool;

  if (typeof createSkillTool !== "function") {
    throw new Error("bash-tool experimental_createSkillTool export not found");
  }

  return createSkillTool as CreateSkillToolFn;
}

export async function loadJustBashConstructor(): Promise<JustBashConstructor> {
  const loadedModule = await loadJustBashModule();
  const Bash = loadedModule.Bash;

  if (typeof Bash !== "function") {
    throw new Error("just-bash Bash export not found");
  }

  return Bash as JustBashConstructor;
}
