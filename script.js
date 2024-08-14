import { rowData } from "./data.js";

class LogoManager {
  constructor(main, logoName, time, index = 0) {
    this.main = main;
    this.logoName = logoName;
    this.time = time;
    this.index = index;
    this.typing = null;
    this.logoContainer = document.createElement("div");
    this.logoContainer.className = "logoContainer";
    this.main.appendChild(this.logoContainer);
    this.logoH1 = document.createElement("h1");
    this.logoContainer.appendChild(this.logoH1);
    this.startTyping();
  }
  createLogo() {
    if (this.index < this.logoName.length) {
      this.logoH1.textContent += this.logoName[this.index];
      this.index++;
    } else {
      this.stopTyping();
      this.logoH1.classList.add("finalLogo");
    }
  }
  startTyping() {
    this.typing = setInterval(() => this.createLogo(), this.time);
  }
  stopTyping() {
    if (this.typing !== null) {
      clearInterval(this.typing);
      this.typing = null;
    }
  }
  deleteLogo() {
    this.logoContainer.remove();
  }
}
class TableManager {
  constructor(header, main) {
    this.header = header;
    this.main = main;
    this.darkItems = [];
    this.buttonsManager();
  }
  buttonsManager() {
    this.main.addEventListener("change", (e) => {
      if (e.target.classList.contains("checkToRemove")) {
        this.createBtnRemoveAll();
      }
    });
    this.main.addEventListener("click", (e) => {
      if (e.target.classList.contains("btnRemove")) {
        this.removeRow(e.target.dataset.rowId);
      } else if (e.target.classList.contains("btnShowMore")) {
        this.showMore(e.target.dataset.rowId);
      } else if (e.target.classList.contains("exitBtn")) {
        this.exitInnerTable(e.target);
      } else if (e.target.classList.contains("btnRemoveAll")) {
        this.removeAll();
      }
    });
  }
  searchById() {
    this.idSearcherContainer = document.createElement("div");
    this.idSearcherContainer.className = "idSearcherContainer";

    this.idLabel = document.createElement("label");
    this.idLabel.setAttribute("for", "searchById");
    this.idLabel.textContent = "Search by ID";

    this.idInput = document.createElement("input");
    this.idInput.setAttribute("type", "number");
    this.idInput.setAttribute("name", "searchById");
    this.idInput.setAttribute("id", "searchById");

    this.idSearcherContainer.append(this.idLabel, this.idInput);
    this.darkItems.push(this.idSearcherContainer);
    this.searchersContainer = document.createElement("div");
    this.searchersContainer.className = "searchersContainer";

    this.tableContainer.insertBefore(this.searchersContainer, this.table);
    this.searchersContainer.appendChild(this.idSearcherContainer);

    const rows = this.table.querySelectorAll("tbody tr");

    this.idInput.addEventListener("input", () => {
      let inputedValue = Number(this.idInput.value);

      if (inputedValue > this.totalRows || inputedValue < 1) {
        inputedValue = "";
        this.idInput.value = "";
      }
      rows.forEach((row) => {
        const rowId = Number(row.dataset.rowId);

        if (this.idInput.value === "" || rowId === inputedValue) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
    this.idInput.setAttribute("placeholder", `1 - ${this.totalRows}`);
  }
  updateIdPlaceholder() {
    if (!this.idInput) return;
    this.idInput.setAttribute(
      "placeholder",
      `${this.totalRows === 0 ? 0 : 1} - ${this.totalRows}`
    );
  }
  searchByName() {
    this.nameSearcherContainer = document.createElement("div");
    this.nameSearcherContainer.className = "nameSearcherContainer";

    this.nameLabel = document.createElement("label");
    this.nameLabel.setAttribute("for", "searchByName");
    this.nameLabel.textContent = `Search by ${this.th2.textContent.toLowerCase()}`;
    this.nameInput = document.createElement("input");
    this.nameInput.setAttribute("type", "text");
    this.nameInput.setAttribute("id", "searchByName");
    this.nameInput.setAttribute(
      "placeholder",
      `${this.th2.textContent.toLowerCase()}`
    );
    this.nameSearcherContainer.append(this.nameLabel, this.nameInput);
    this.searchersContainer.appendChild(this.nameSearcherContainer);
    this.darkItems.push(this.nameSearcherContainer);
    this.nameInput.addEventListener("input", () => {
      const searchedName = this.nameInput.value.toLowerCase();
      const rows = this.table.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const cell2 = row.querySelector("td:nth-of-type(2)");
        const cell2Value = cell2.textContent.toLowerCase();

        if (searchedName === "" || cell2Value.includes(searchedName)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }
  createTable(keyValue) {
    this.keyValue = keyValue;
    this.totalRows = this.keyValue.length;
    this.currentPage = 1;
    this.rowsPerPage = 10;
    if (this.tableContainer) {
      this.tableContainer.remove();
    }

    if (!this.keyValue || this.totalRows === 0) {
      tableMessage();
      this.updateIdPlaceholder();
      return;
    }

    this.tableContainer = document.createElement("div");
    this.tableContainer.className = "tableContainer";
    this.main.appendChild(this.tableContainer);
    this.table = document.createElement("table");
    this.tableContainer.appendChild(this.table);
    this.thead = document.createElement("thead");
    this.table.appendChild(this.thead);
    this.theadRow = document.createElement("tr");
    this.thead.appendChild(this.theadRow);

    this.th1 = document.createElement("th");
    this.th1.textContent = "ID";
    this.th2 = document.createElement("th");
    this.th3 = document.createElement("th");
    this.th4 = document.createElement("th");
    this.th5 = document.createElement("th");
    this.th5.textContent = "CREATED";
    this.th5.className = "withRemoval";
    this.th6 = document.createElement("th");
    this.th6.textContent = "ACTIONS";

    this.sampleItem = this.keyValue[0];
    this.itemKeys = Object.keys(this.sampleItem).filter(
      (key) => key !== "created"
    );
    this.th2.textContent = this.itemKeys[0].toUpperCase();
    this.th3.textContent = this.itemKeys[1].toUpperCase();
    this.th4.textContent = this.itemKeys[2].toUpperCase();
    this.theadRow.append(
      this.th1,
      this.th2,
      this.th3,
      this.th4,
      this.th5,
      this.th6
    );
    this.tbody = document.createElement("tbody");
    this.table.appendChild(this.tbody);

    this.keyValue.forEach((item, index) => {
      const tbodyRow = document.createElement("tr");
      tbodyRow.dataset.rowId = index + 1;

      const cell1Id = document.createElement("td");
      cell1Id.textContent = index + 1;

      const cell2 = document.createElement("td");
      cell2.textContent = item[this.itemKeys[0]];

      const cell3 = document.createElement("td");
      cell3.textContent = item[this.itemKeys[1]];

      const cell4 = document.createElement("td");
      cell4.textContent = item[this.itemKeys[2]];

      const cell5Created = document.createElement("td");
      const cell5Date = new Date(item.created);
      cell5Created.textContent = cell5Date.toLocaleDateString("pl-PL");

      const cell6Actions = document.createElement("td");
      const actionsContainer = document.createElement("div");
      actionsContainer.className = "actionsContainer";
      cell6Actions.appendChild(actionsContainer);
      const btnRemove = document.createElement("i");
      btnRemove.className = "btnRemove fa-solid fa-trash";
      btnRemove.dataset.rowId = index + 1;
      const btnShowMore = document.createElement("i");
      btnShowMore.className = "btnShowMore fa-solid fa-square-plus";
      btnShowMore.dataset.rowId = index + 1;
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.className = "checkToRemove";
      checkbox.setAttribute("id", `${index + 1}`);

      actionsContainer.append(btnRemove, btnShowMore, checkbox);
      tbodyRow.append(cell1Id, cell2, cell3, cell4, cell5Created, cell6Actions);
      this.tbody.appendChild(tbodyRow);
      this.darkItems.push(this.theadRow, tbodyRow, btnRemove, btnShowMore);
    });
    this.updateIdPlaceholder();
    this.searchById();
    this.searchByName();
    this.paginationManager();
  }
  paginationManager() {
    if (this.paginationContainer) {
      this.paginationContainer.remove();
    }
    this.paginationContainer = document.createElement("div");
    this.paginationContainer.className = "paginationContainer";

    this.leftArrow = document.createElement("i");
    this.leftArrow.classList = "fa-solid fa-arrow-left";
    this.rightArrow = document.createElement("i");
    this.rightArrow.classList = "fa-solid fa-arrow-right";

    this.paginationInput = document.createElement("input");
    this.paginationInput.value = this.currentPage;
    this.paginationInput.min = 1;
    this.paginationInput.setAttribute("type", "number");
    this.paginationInput.setAttribute("id", "pageNumber");
    this.paginationInput.setAttribute("placeholder", "1");
    this.paginationLabel = document.createElement("label");
    this.paginationLabel.className = "paginationLabel";
    this.paginationLabel.setAttribute("for", "pageNumber");
    this.selectOption = document.createElement("select");
    this.selectOption.setAttribute("id", "selectOption");
    this.option10 = document.createElement("option");
    this.option10.value = "10";
    this.option10.textContent = "10";
    this.option20 = document.createElement("option");
    this.option20.value = "20";
    this.option20.textContent = "20";
    this.selectOption.append(this.option10, this.option20);

    this.paginationContainer.append(
      this.leftArrow,
      this.paginationInput,
      this.paginationLabel,
      this.rightArrow,
      this.selectOption
    );
    this.main.appendChild(this.paginationContainer);
    this.darkItems.push(
      this.leftArrow,
      this.paginationInput,
      this.paginationLabel,
      this.rightArrow,
      this.selectOption
    );

    this.selectOption.addEventListener("change", () => {
      const newRowsPerPage = parseInt(this.selectOption.value) || 10;
      const totalPages = Math.ceil(this.totalRows / newRowsPerPage);

      const newPage =
        Math.ceil(
          ((this.currentPage - 1) * this.rowsPerPage) / newRowsPerPage
        ) + 1;
      this.currentPage = Math.min(newPage, totalPages);

      this.rowsPerPage = newRowsPerPage;
      this.paginationInput.value = this.currentPage;
      this.updatesTableAndPagination();
    });

    this.leftArrow.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.paginationInput.value = this.currentPage;
        this.updatesTableAndPagination();
      }
    });

    this.rightArrow.addEventListener("click", () => {
      const totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.paginationInput.value = this.currentPage;
        this.updatesTableAndPagination();
      }
    });

    this.paginationInput.addEventListener("input", () => {
      const totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
      if (this.paginationInput.value > totalPages) {
        this.paginationInput.value = totalPages;
      }
      this.currentPage = parseInt(this.paginationInput.value) || 1;
      this.updatesTableAndPagination();
    });

    this.updatesTableAndPagination();
  }
  updatesTableAndPagination() {
    const totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
    this.currentPage = Math.max(1, Math.min(this.currentPage, totalPages));

    const rows = Array.from(this.table.querySelectorAll("tbody tr"));
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;

    rows.forEach((row, index) => {
      if (index >= startIndex && index < endIndex) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });

    this.paginationLabel.textContent = `z ${totalPages === 0 ? 1 : totalPages}`;
    this.leftArrow.classList.toggle("disabled", this.currentPage === 1);
    this.rightArrow.classList.toggle(
      "disabled",
      this.currentPage === totalPages
    );
    this.paginationInput.value = this.currentPage;
  }
  createBtnRemoveAll() {
    const activeCheckboxes = this.main.querySelectorAll(
      ".checkToRemove:checked"
    );
    this.btnRemoveAll = this.main.querySelector(".btnRemoveAll");
    if (activeCheckboxes.length > 0 && !this.btnRemoveAll) {
      this.btnRemoveAll = document.createElement("button");
      this.btnRemoveAll.className = "btnRemoveAll";
      this.btnRemoveAll.textContent = "REMOVE ALL";
      this.th5.appendChild(this.btnRemoveAll);
    } else if (activeCheckboxes.length < 1 && this.btnRemoveAll) {
      this.btnRemoveAll.remove();
    }
  }
  removeRow(rowId) {
    const id = Number(rowId);
    const row = this.main.querySelector(`tr[data-row-id='${id}']`);
    if (row) {
      row.remove();
      this.totalRows--;
      const hasRows = this.main.querySelector(".tableContainer tbody tr");
      if (!hasRows) {
        if (this.currentPage === 1) {
          this.tableMessage();
        }
      }
      this.updatesTableAndPagination();
      this.updateIdPlaceholder();
    }
  }
  removeAll() {
    const activeCheckboxes = this.main.querySelectorAll(
      ".checkToRemove:checked"
    );
    activeCheckboxes.forEach((checkbox) => {
      const rowId = checkbox.id;
      const rowsToRemove = this.main.querySelector(
        `tr[data-row-id='${rowId}']`
      );
      if (rowsToRemove) {
        rowsToRemove.remove();
        this.btnRemoveAll.remove();
      }
    });

    this.totalRows -= activeCheckboxes.length;

    const hasRows = this.main.querySelector(".tableContainer tbody tr");
    if (!hasRows) {
      if (this.currentPage === 1) {
        const message = document.createElement("div");
        message.className = "emptyTableMessage";
        message.textContent = "Brak elementów do wyświetlenia";
        this.tableContainer.appendChild(message);
      }
    }
    this.updatesTableAndPagination();
    this.updateIdPlaceholder();
  }
  showMore(rowId) {
    const btnShowMore = this.main.querySelector(".btnShowMore");
    if (rowId) {
      const innerItem = this.keyValue[rowId - 1];
      const innerItemKeys = Object.keys(innerItem);

      const existingInnerTable =
        this.main.querySelector(`.innerTableContainer`);
      if (existingInnerTable) {
        return;
      } else if (!existingInnerTable) {
        this.blurManager();
        const innerTableContainer = document.createElement("div");
        innerTableContainer.className = "innerTableContainer";
        innerTableContainer.dataset.itemId = rowId;

        const exitBtn = document.createElement("i");
        exitBtn.classList = "exitBtn";
        exitBtn.textContent = "CLOSE";
        const innerTable = document.createElement("table");
        innerTableContainer.append(exitBtn, innerTable);
        this.innerThead = document.createElement("thead");
        innerTable.appendChild(this.innerThead);
        const tr = document.createElement("tr");
        this.innerThead.appendChild(tr);

        const th1 = document.createElement("th");
        th1.textContent = "KEY";
        const th2 = document.createElement("th");
        th2.textContent = "VALUE";
        tr.append(th1, th2);

        const tbody = document.createElement("tbody");
        innerTable.appendChild(tbody);
        if (btnShowMore.classList.contains("darkThemeMode")) {
          tr.classList.add("darkThemeMode");
          exitBtn.classList.add("darkThemeMode");
        } else {
          tr.classList.remove("darkThemeMode");
          exitBtn.classList.remove("darkThemeMode");
        }
        innerItemKeys.forEach((key) => {
          const innerRow = document.createElement("tr");
          const tdKey = document.createElement("td");
          tdKey.textContent = key;
          const tdValue = document.createElement("td");
          tdValue.textContent = innerItem[key];
          innerRow.append(tdKey, tdValue);
          tbody.appendChild(innerRow);
          if (btnShowMore.classList.contains("darkThemeMode")) {
            innerRow.classList.add("darkThemeMode");
          } else {
            innerRow.classList.remove("darkThemeMode");
          }
        });

        this.main.appendChild(innerTableContainer);
        if (innerTable.offsetHeight > window.innerHeight) {
          tbody.querySelectorAll("td").forEach((td) => {
            td.className = "innerTdResize";
          });
        }
      }
    }
  }
  exitInnerTable(target) {
    const innerTableContainer = target.closest(".innerTableContainer");
    if (innerTableContainer) {
      innerTableContainer.remove();
      this.blurManager();
    }
  }
  blurManager() {
    if (!this.blurContainer) {
      this.blurContainer = document.createElement("div");
      this.blurContainer.classList.add("addBlur");
      document.body.appendChild(this.blurContainer);
      document.body.removeChild(this.header);
      document.body.removeChild(this.main);
      this.blurContainer.append(this.header, this.main);
    } else {
      this.blurContainer.remove(this.header);
      this.blurContainer.remove(this.main);
      document.body.append(this.header, this.main);
      this.blurContainer = null;
    }
  }
  tableMessage() {
    const message = document.createElement("div");
    message.className = "emptyTableMessage";
    message.textContent = "Brak elementów do wyświetlenia";
    this.tableContainer.appendChild(message);
  }
  applyDarkTheme() {
    this.darkItems.forEach((item) => {
      item.classList.add("darkThemeMode");
    });
  }
  applyColorTheme() {
    this.darkItems.forEach((item) => {
      item.classList.remove("darkThemeMode");
    });
  }
}
class HeaderManager {
  constructor(header, soundList, data, logo, tableManager) {
    this.header = header;
    this.soundList = soundList;
    this.voices = Object.keys(soundList);
    this.voice1 = this.voices[0];
    this.voice2 = this.voices[1];
    this.topHeader = document.createElement("div");
    this.topHeader.className = "topHeader";
    this.header.append(this.topHeader);
    this.topHeaderItems = document.createElement("div");
    this.topHeaderItems.className = "topHeaderItems";
    this.topHeader.append(this.topHeaderItems);
    this.keySequence = "";
    this.maxSequenceLength = this.calcMaxSequenceLength();
    this.keysListener();
    this.currentAudio = null;
    this.data = data;
    this.logo = logo;
    this.tableManager = tableManager;
    this.itemsColorChange = [];
    this.createAudioInstruction();
    this.createColorButtons();
    this.createMenu();
    this.darkTheme();
    this.colorTheme();
  }
  createAudioInstruction() {
    this.audioInstruction = document.createElement("h2");
    this.audioInstruction.className = "audioInstruction";
    this.audioInstruction.textContent = `Write ${this.voice1} or ${this.voice2} and hear them! Press 9 to stop.`;
    this.topHeaderItems.appendChild(this.audioInstruction);
  }
  createColorButtons() {
    this.colorfulThemeButton = document.createElement("button");
    this.colorfulThemeButton.className = "colorfulTheme";
    this.colorfulThemeButton.textContent = "COLORFUL THEME";

    this.darkThemeButton = document.createElement("button");
    this.darkThemeButton.className = "darkTheme";
    this.darkThemeButton.textContent = "DARK THEME";
    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.className = "buttonsContainer";
    this.topHeaderItems.append(this.buttonsContainer);
    this.buttonsContainer.append(
      this.colorfulThemeButton,
      this.darkThemeButton
    );
  }
  darkTheme() {
    this.itemsColorChange.push(
      this.audioInstruction,
      this.logo.logoH1,
      document.body
    );
    this.darkThemeButton.addEventListener("click", () => {
      this.itemsColorChange.forEach((item) => {
        item.classList.add("darkThemeMode");
      });
      this.tableManager.applyDarkTheme();
    });
  }
  colorTheme() {
    this.colorfulThemeButton.addEventListener("click", () => {
      this.itemsColorChange.forEach((item) => {
        item.classList.remove("darkThemeMode");
      });
      this.tableManager.applyColorTheme();
    });
  }
  calcMaxSequenceLength() {
    return Math.max(...this.voices.map((voice) => voice.length));
  }
  keysListener() {
    document.addEventListener("keydown", (e) => this.soundtrackManager(e));
  }
  soundtrackManager(e) {
    if (e.key === "9") {
      this.stopSound();
    }
    if (e.key.length === 1) {
      this.keySequence += e.key.toLowerCase();
    }
    if (this.keySequence.length > this.maxSequenceLength) {
      this.keySequence = this.keySequence.slice(-this.maxSequenceLength);
    }

    for (const voice in this.soundList) {
      if (this.keySequence.endsWith(voice.toLowerCase())) {
        this.playSound(this.soundList[voice]);
        this.keySequence = "";
        break;
      }
    }
  }
  playSound(soundPath) {
    this.stopSound();
    this.currentAudio = new Audio(soundPath);
    this.currentAudio.play();
  }
  stopSound() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }
  createMenu() {
    this.nav = document.createElement("nav");
    this.keys = Object.keys(this.data);
    this.keys.forEach((key) => {
      this.navButton = document.createElement("button");
      this.navButton.textContent = key;
      this.navButton.className = key;
      this.nav.appendChild(this.navButton);
      this.itemsColorChange.push(this.navButton);
      this.navButton.addEventListener("click", () => {
        this.logo.deleteLogo();
        this.keyValue = this.data[key];
        this.tableManager.createTable(this.keyValue);
        if (this.navButton.classList.contains("darkThemeMode")) {
          this.tableManager.applyDarkTheme();
        }
      });
    });
    this.header.appendChild(this.nav);
  }
}

const header = document.createElement("header");
const main = document.createElement("main");
document.body.append(header, main);

const soundList = {
  "Star Wars": "./sound/themeSong.mp3",
  "Obi Wan Kenobi": "./sound/obiWanKenobi.mp3",
};
const logoApp = new LogoManager(main, "STAR WARS", 200);
const tableManagerApp = new TableManager(header, main);
const headerApp = new HeaderManager(
  header,
  soundList,
  rowData,
  logoApp,
  tableManagerApp
);
