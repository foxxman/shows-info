import settings from "@core/settings";
import FilterDropdown from "./FilterDropdown";
import ShowCard from "./ShowCard";

export default class ShowsList {
  #SHOWS_URL;
  #shows;
  #state;

  #container;
  #showsList;

  #activeFilters;
  #filtersToCreate;
  #createdFilters;
  #filtersArrays;

  constructor(container) {
    this.#SHOWS_URL = settings.showsURL;
    this.#filtersToCreate = ["genres", "status", "language"];
    this.#filtersArrays = {};

    this.#filtersToCreate.forEach(
      (filterToCreate) => (this.#filtersArrays[filterToCreate] = [])
    );

    this.#createdFilters = [];

    this.#shows = [];
    this.#state = [];

    this.#activeFilters = {};
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
      return information;
    }
  }

  createListElement(show) {
    const li = new ShowCard(show);
    return li.render();
  }

  setFilterList(filter, value) {
    // очищаем state и заполняем его всеми элементами, без фильтров
    this.#state.splice(0, this.#state.length);
    this.#state.push(...this.#shows);

    // если свойства заданы - фильтруем
    if (filter && value) {
      // добавить или изменить значение фильтра
      this.#activeFilters[filter] = value;

      //итерация по названиям фильтров(ключи объекта массивов активных фильтров)
      Object.keys(this.#activeFilters).forEach((key) => {
        // создаем копию state, а его очищаем
        const stateCopy = [...this.#state];
        this.#state.splice(0, this.#state.length);

        // создаем новый массив из stateCopy на основе итерируемого фильтра
        // и добавляем все его элементы в пустой state
        this.#state.push(
          ...stateCopy.filter((show) => {
            const filterType = typeof show[key];
            let status;
            // console.log(show[key], this.#activeFilters[key]);

            // фильтр в зависимости от типа его значения
            switch (filterType) {
              // массив
              case "object":
                status = show[key].includes(this.#activeFilters[key]);
                break;
              //строка
              case "string":
                status = show[key] === this.#activeFilters[key];
                break;
              default:
                break;
            }
            // console.log(status);
            return status;
          })
        );
      });
    } else {
      // если свойства не заданы - очищаем фильтры
      Object.keys(this.#activeFilters).forEach((key) => {
        delete this.#activeFilters[key];
      });
    }

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

        // заполнение объекта с массивами фильтров
        shows.forEach((show) => {
          this.#filtersToCreate.forEach((filterToCreate) => {
            //если это массив
            if (typeof show[filterToCreate] === "object") {
              show[filterToCreate].forEach((filterItem) => {
                !this.#filtersArrays[filterToCreate].includes(filterItem)
                  ? this.#filtersArrays[filterToCreate].push(filterItem)
                  : "";
              });
            } else {
              // если что-то другое
              !this.#filtersArrays[filterToCreate].includes(
                show[filterToCreate]
              )
                ? this.#filtersArrays[filterToCreate].push(show[filterToCreate])
                : "";
            }
          });
        });
      })
      .finally(() => {
        // рендер полей фильтров
        Object.keys(this.#filtersArrays).forEach((filterName, index) => {
          this.#createdFilters.push(
            new FilterDropdown(
              filterName,
              this.#filtersArrays[filterName],
              this.setFilterList.bind(this)
            )
          );
          // console.log(this.#createdFilters);
          this.#createdFilters[index].render();
        });
        // рендер полей фильтров
        this.makeShowList();
      });
  }
}
