import * as shell from "shelljs";

// Copy views folder
shell.cp("-R", "src/views", "dist/");
// Copy public folder
shell.cp("-R", "src/public", "dist/");