import settings from "@core/settings";
import GenersList from "./GenersList";
import ShowCard from "./ShowCard";
import StatusesList from "./StatusList";

export default class ShowsList {
  #SHOWS_URL;
  #shows;
  #container;
  #showsList;
  #genersList;
  #statusesList;
  #state;
  #listFilters;
  #geners;
  #statuses;

  constructor(container) {
    this.#SHOWS_URL = settings.showsURL;
    this.#geners = [];
    this.#statuses = [];
    this.#listFilters = {
      status: "",
      category: "",
    };
    this.#container = container;
    this.#showsList = document.createElement("ul");
    this.#showsList.className = "shows__list";
  }

  async getUrlInformation(url) {
    let isLoading = false;
    let information;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("data not received");
      information = await response.json();
      //   console.log(information);
    } catch {
      console.log("Error: ", error);
    } finally {
      isLoading = true;
      return information;
    }
  }

  createListElement(show) {
    const li = new ShowCard(show);
    return li.render();
  }

  setGenerList(gener) {
    if (document.querySelector(".shows__list"))
      document.querySelector(".shows__list").remove();
    this.#showsList.innerHTML = "";
    console.log(this.#showsList);
    this.#shows.forEach((show) => {
      if (show.genres.includes(gener)) {
        this.#showsList.append(this.createListElement(show));
      }
    });
    this.#container.append(this.#showsList);
  }

  setStatusesList(status) {
    if (document.querySelector(".shows__list"))
      document.querySelector(".shows__list").remove();
    console.log(this.#showsList);
    this.#showsList.innerHTML = "";
    this.#shows.forEach((show) => {
      if (show.status === status) {
        this.#showsList.append(this.createListElement(show));
      }
    });
    this.#container.append(this.#showsList);
  }

  makeShowList() {
    if (document.querySelector(".shows__list"))
      document.querySelector(".shows__list").remove();
    this.#showsList.innerHTML = "";

    this.#state.forEach((show) => {
      this.#showsList.append(this.createListElement(show));
    });

    this.#container.append(this.#showsList);
  }

  render() {
    this.getUrlInformation(this.#SHOWS_URL)
      .then((shows) => {
        this.#shows = shows;
        this.#state = shows;
        shows.forEach((show) => {
          show.genres.forEach((gener) =>
            !this.#geners.includes(gener) ? this.#geners.push(gener) : ""
          );

          !this.#statuses.includes(show.status)
            ? this.#statuses.push(show.status)
            : "";
        });
      })
      .finally(() => {
        this.#genersList = new GenersList(
          this.#geners,
          this.setGenerList.bind(this)
        );

        this.#statusesList = new StatusesList(
          this.#statuses,
          this.setStatusesList.bind(this)
        );

        this.#genersList.render();
        this.#statusesList.render();

        this.makeShowList();
      });
  }
}
