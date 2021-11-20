import * as $ from "jquery";

export default class StatusesList {
  #statuses;
  #statusesMenu;

  constructor(statuses, setStatusList) {
    this.setStatusList = setStatusList;
    this.#statuses = statuses;
    this.#statusesMenu = document.querySelector("#dropdown-menu-statuses");
  }

  initListener() {
    const activeStatus = document.querySelector("#active-status");
    /*Dropdown Menu*/
    $("#dropdown-statuses").click(function () {
      $(this).attr("tabindex", 1).focus();
      $(this).toggleClass("active");
      $(this).find(".dropdown-menu").slideToggle(300);
    });
    $("#dropdown-statuses").focusout(function () {
      $(this).removeClass("active");
      $(this).find(".dropdown-menu").slideUp(300);
    });

    this.#statusesMenu.addEventListener("click", (event) => {
      const { target } = event;
      const li = target.closest("li");
      if (li) {
        this.setStatusList(li.id);
        activeStatus.innerHTML = li.id;
      }
    });
  }

  render() {
    console.log(this.#statuses);
    this.#statuses.forEach((status) => console.log(status));
    this.#statuses.forEach((status) => {
      const li = document.createElement("li");
      li.id = `${status}`;
      li.textContent = status;
      this.#statusesMenu.append(li);
    });
    this.initListener();
  }
}
