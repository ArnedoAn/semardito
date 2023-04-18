import { spawn, exec } from "child_process";
import { logError } from "./extraFunctions";
import path from "path";

export default async function markAttendance(
  date: string,
  names: string[],
  month: string,
  filePath: string
): Promise<boolean | undefined> {
  try {
    preScript();
  } catch (error: Error | any) {
    console.log(error);
    await logError(error);
    return false;
  }

  try {

    const scriptPath = path.join(process.cwd(), "python", "attendanceScript.py");

    const pythonProcess = spawn("python", [
      scriptPath,
      date,
      names.join(","),
      month,
      filePath,
    ]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        logError(new Error(`Python script exited with code ${code}`));
        return false;
      }

      console.log("Python script finished successfully");
      return true;
    });
  } catch (error: Error | any) {
    console.error(
      `An error occurred while executing the Python script: ${error}`
    );
    await logError(error);
    return false;
  }
}

async function preScript() {
  let venvCommand;
  let activateCommand;
  let pipCommand;

  if (process.platform === "win32") {
    venvCommand = "python -m venv venv";
    activateCommand = "venv\\Scripts\\activate";
    pipCommand = "pip install pandas";
  } else {
    venvCommand = "python3 -m venv venv";
    activateCommand = "source venv/bin/activate";
    pipCommand = "pip3 install pandas";
  }

  exec(venvCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  exec(activateCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  exec(pipCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}
