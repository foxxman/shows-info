import settings from "@core/settings";
import GenersList from "./GenersList";
import ShowCard from "./ShowCard";

export default class ShowsList {
  #SHOWS_URL;
  #shows;
  #geners;
  #container;
  #showsList;
  #genersList;

  constructor(container) {
    this.#SHOWS_URL = settings.showsURL;
    this.#geners = [];
    this.#container = container;
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
    show.genres.forEach((gener) =>
      !this.#geners.includes(gener) ? this.#geners.push(gener) : ""
    );

    const li = new ShowCard(show);
    return li.render();
  }

  setGenerList(gener) {
    document.querySelector(".shows__list").remove();
    this.#showsList.innerHTML = "";
    console.log(this.#shows);
    this.#shows.forEach((show) => {
      if (show.genres.includes(gener)) {
        this.#showsList.append(this.createListElement(show));
        console.log(this.#showsList);
      }
    });
    this.#container.append(this.#showsList);
  }

  render() {
    this.getUrlInformation(this.#SHOWS_URL)
      .then((shows) => {
        this.#shows = shows;

        this.#showsList = document.createElement("ul");
        this.#showsList.className = "shows__list";

        this.#shows.forEach((show) => {
          this.#showsList.append(this.createListElement(show));
        });
      })
      .finally(() => {
        this.#genersList = new GenersList(
          this.#geners,
          this.setGenerList.bind(this)
        );
        this.#genersList.render();
        this.#container.append(this.#showsList);
      });
  }
}
