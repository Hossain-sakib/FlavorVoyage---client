import fs from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
export default function teardown() {
  const directory = process.env.FV_E2E_DATA_DIR;
  if (
    directory &&
    path.dirname(directory) === tmpdir() &&
    path.basename(directory).startsWith("flavorvoyage-e2e-")
  )
    fs.rmSync(directory, { recursive: true, force: true });
}
