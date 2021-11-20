import settings from "@core/settings";

export default class ShowsList {
  #SHOWS_URL;
  #shows;
  #showsList;

  constructor() {
    this.#SHOWS_URL = settings.showsURL;
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
    const li = document.createElement("li");
    li.className = "shows__list__item";
    li.id = `show-${show.id}`;

    li.innerHTML = `${show.name}`;

    return li;
  }

  render(container) {
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
        container.append(this.#showsList);
      });
  } 
}
