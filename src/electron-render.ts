const { ipcRenderer } = require("electron");

let btnMigrate = document.querySelector("#btnMigrate");
let sourceConnectionStringInput = <HTMLInputElement>(
  document.querySelector("#sourceConnectionString")
);
let destConnectionStringInput = <HTMLInputElement>(
  document.querySelector("#destConnectionString")
);
let sourceDatabaseNameInput = <HTMLInputElement>(
  document.querySelector("#sourceDatabaseName")
);
let destDatabaseNameInput = <HTMLInputElement>(
  document.querySelector("#destDatabaseName")
);

btnMigrate!.addEventListener("click", () => {
  btnMigrate!.setAttribute("disabled", "true");
  ipcRenderer.send("migrate", {
    sourceConnectionString: sourceConnectionStringInput!.value,
    destConnectionString: destConnectionStringInput!.value,
    sourceDatabaseName: sourceDatabaseNameInput!.value,
    destDatabaseName: destDatabaseNameInput!.value,
  });
});

ipcRenderer.on("migrate", (event, arg) => {
  btnMigrate!.removeAttribute("disabled");
  alert(arg.message);
});
