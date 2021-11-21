import * as $ from "jquery";

export default class FilterDropdown {
  #filterArray;
  #filterMenu;
  #filterDiv;
  #filterName;

  constructor(filterName, filterArray, setFilterList) {
    this.setFilterList = setFilterList;
    this.#filterArray = filterArray;
    this.#filterName = filterName;

    this.#filterDiv = document.createElement("div");
    this.#filterDiv.className = "dropdown";
    this.#filterDiv.id = `dropdown-${this.#filterName}`;
    this.#filterDiv.innerHTML = `
    <div class="select">
        <span id="active-${this.#filterName}">${
      this.#filterName[0].toUpperCase() + this.#filterName.slice(1)
    } Filter</span>
        <i class="fa fa-chevron-left"></i>
    </div>
    <input type="hidden" name="${this.#filterName}" />
    <ul id="dropdown-menu-${this.#filterName}" class="dropdown-menu"></ul>
    `;
  }

  initListener() {
    const activeFilter = document.querySelector(`#active-${this.#filterName}`);
    /*Dropdown Menu*/
    $(`#dropdown-${this.#filterName}`).click(function () {
      $(this).attr("tabindex", 1).focus();
      $(this).toggleClass("active");
      $(this).find(".dropdown-menu").slideToggle(300);
    });
    $(`#dropdown-${this.#filterName}`).focusout(function () {
      $(this).removeClass("active");
      $(this).find(".dropdown-menu").slideUp(300);
    });

    this.#filterMenu.addEventListener("click", (event) => {
      const { target } = event;
      const li = target.closest("li");
      if (li) {
        this.setFilterList(this.#filterName, li.id);
        activeFilter.innerHTML = li.id;
      }
    });
  }

  render() {
    document.querySelector("#filters-container").append(this.#filterDiv);

    this.#filterMenu = document.querySelector(
      `#dropdown-menu-${this.#filterName}`
    );

    this.#filterArray.forEach((filterElement) => {
      const li = document.createElement("li");
      li.id = `${filterElement}`;
      li.textContent = filterElement;
      this.#filterMenu.append(li);
    });

    this.initListener();
  }
}
