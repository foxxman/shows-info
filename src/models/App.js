import ShowsList from "./ShowsList";

export default class App {
  #showsList;
  #listContainer;

  constructor() {
    this.#showsList = new ShowsList();
    this.#listContainer = document.querySelector("#list-container");
  }

  run() {
    this.#showsList.render(this.#listContainer);
  }
}
