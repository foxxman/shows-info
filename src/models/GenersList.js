import * as $ from "jquery";

export default class GenersList {
  #geners;
  #genersMenu;

  constructor(geners, setGenerList) {
    this.setGenerList = setGenerList;
    this.#geners = geners;
    this.#genersMenu = document.querySelector("#dropdown-menu-geners");
  }

  initListener() {
    const activeGener = document.querySelector("#active-gener");
    /*Dropdown Menu*/
    $("#dropdown-geners").click(function () {
      $(this).attr("tabindex", 1).focus();
      $(this).toggleClass("active");
      $(this).find(".dropdown-menu").slideToggle(300);
    });
    $("#dropdown-geners").focusout(function () {
      $(this).removeClass("active");
      $(this).find(".dropdown-menu").slideUp(300);
    });

    this.#genersMenu.addEventListener("click", (event) => {
      const { target } = event;
      const li = target.closest("li");
      if (li) {
        this.setGenerList(li.id);
        activeGener.innerHTML = li.id;
      }
    });
  }

  render() {
    this.#geners.forEach((gener) => {
      const li = document.createElement("li");
      li.id = `${gener}`;
      li.textContent = gener;
      this.#genersMenu.append(li);
    });
    this.initListener();
  }
}
