import settings from "@core/settings";
import ShowCard from "./ShowCard";

export default class ShowsList {
  #SHOWS_URL;
  #shows;
  #showsList;
  #geners;

  constructor() {
    this.#SHOWS_URL = settings.showsURL;
    this.#geners = [];
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

  render(container) {
    this.getUrlInformation(this.#SHOWS_URL)
      .then((shows) => {
        this.#shows = shows;

        this.#showsList = document.createElement("ul");
        this.#showsList.className = "shows__list";

        this.#shows.forEach((show) => {
          show.genres.forEach((gener) =>
            !this.#geners.includes(gener) ? this.#geners.push(gener) : ""
          );
          
          this.#showsList.append(this.createListElement(show));
        });
      })
      .finally(() => {
        container.append(this.#showsList);
      });
  }
}
