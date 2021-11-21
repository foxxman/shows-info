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
    this.#shows = [];
    this.#state = [];
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
    } catch {
      console.log("Error: ", error);
    } finally {
      isLoading = true;
      // console.log("incoming information");
      // information.forEach((info) => console.log(info));
      return information;
    }
  }

  createListElement(show) {
    const li = new ShowCard(show);
    return li.render();
  }

  setGenerList(gener) {
    const stateCopy = [...this.#state]
    this.#state.splice(0, this.#state.length);

    this.#state.push(...stateCopy.filter((show) => show.genres.includes(gener)));
    this.makeShowList();
  }

  setStatusesList(status) {
    const stateCopy = [...this.#state]

    this.#state.splice(0, this.#state.length);
    this.#state.push(...stateCopy.filter((show) => show.status === status));
    this.makeShowList();
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
        this.#shows.push(...shows);
        this.#state.push(...shows);

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
