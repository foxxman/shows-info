import ShowsList from "./ShowsList";

export default class App {
  #showsList;

  constructor() {
    this.listContainer = document.querySelector("#list-container");
    this.#showsList = new ShowsList(this.listContainer);
  }

  run() {
    this.#showsList.render();
  }
}
