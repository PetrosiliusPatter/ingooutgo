/// <reference lib="deno.ns" />
import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts"

const outDir = "./build/npm"

await emptyDir(outDir)
await emptyDir(outDir + "/assets")

const [version] = Deno.args
if (!version) {
  throw new Error("a version argument is required to build the npm package")
}

await build({
  entryPoints: ["./index.ts"],
  outDir,
  shims: {
    deno: false,
  },
  test: false,
  compilerOptions: {
    target: "ES2020",
    sourceMap: true,
    lib: ["ES2021", "DOM"],
  },
  mappings: {
    "https://esm.sh/react@18.2.0": {
      name: "react",
      version: "^18.2.0",
      peerDependency: true,
    },
    "https://esm.sh/zod@3.22.4": {
      name: "zod",
      version: "^3.22.4",
      peerDependency: true,
    },
    "https://esm.sh/@nodl/core@1.0.9": {
      name: "@nodl/core",
      version: "^1.0.9",
      peerDependency: true,
    },
    "https://esm.sh/@emotion/styled@11.11.0": {
      name: "@emotion/styled",
      version: "^11.11.0",
      peerDependency: true,
    },
  },
  package: {
    name: "ingooutgo",
    version,
    description: "Custom UI for @nodl/core",
    license: "MIT",
    author: "PetrosiliusPatter",
    repository: {
      type: "git",
      url: "git+https://github.com/PetrosiliusPatter/ingooutgo.git",
    },
    bugs: {
      url: "https://github.com/PetrosiliusPatter/ingooutgo/issues",
    },
    engines: {
      node: ">= 14",
    },
    devDependencies: {
      "@types/react": "18.2.0",
      "react": "18.2.0",
      "zod": "3.22.4",
      "@nodl/core": "1.0.9",
    },
  },
})

// Copies the readme
await Deno.copyFile("README.md", `${outDir}/README.md`)
await Deno.copyFile("assets/icon.png", `${outDir}/assets/icon.png`)
