import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const streamlitDir = path.resolve(__dirname, "../../../../streamlit-ds");
const calculatorPath = path.join(streamlitDir, "run_calculator.py");

export function runPythonCalculator(inputPayload) {
  return new Promise((resolve, reject) => {
    const py = spawn(env.pythonCommand, [calculatorPath], {
      cwd: streamlitDir,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      py.kill("SIGTERM");
      reject(new AppError(`Kalkulasi timeout (> ${env.projectionTimeoutMs} ms)`, 504));
    }, env.projectionTimeoutMs);

    py.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf-8");
    });

    py.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf-8");
    });

    py.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);

      if (code !== 0) {
        return reject(new AppError(`Kalkulasi gagal (exit code ${code})`, 502, stderr));
      }

      try {
        const jsonStart = stdout.indexOf("{");
        if (jsonStart === -1) {
          throw new Error("Output Python tidak mengandung JSON valid");
        }

        resolve(JSON.parse(stdout.substring(jsonStart)));
      } catch (error) {
        reject(new AppError(`Gagal parse output JSON: ${error.message}`, 502, stdout));
      }
    });

    py.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(new AppError(`Gagal menjalankan Python: ${error.message}`, 502));
    });

    py.stdin.write(JSON.stringify(inputPayload));
    py.stdin.end();
  });
}
