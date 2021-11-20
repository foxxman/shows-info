export default class ShowCard {
  #state;
  #li;

  constructor(state) {
    this.#state = state;
    // console.log(state);
    this.createElement();
  }

  editText(text) {
    const textLimit = 330;

    // text.replace(/<\/?[^>]+(>|$)/g, "");
    const temp = document.createElement("div");
    temp.innerHTML = text;
    const sanitized = temp.textContent || temp.innerText;
    let sliced = sanitized.slice(0, textLimit);

    if (sliced.length < text.length) {
      sliced += "...";
    }

    return sliced;
  }

  createElement() {
    // console.log(this.#state);
    this.#li = document.createElement("li");
    this.#li.className = "shows__list__item";
    this.#li.id = `show-${this.#state.id}`;
    
    const genres = [...this.#state.genres];
    const statusClasses =[];
    if(this.#state.status==='Running') statusClasses.push('running-serial');
    if(this.#state.status==='Ended') statusClasses.push('ended-serial');


    this.#li.innerHTML = `
    <img class="shows__list__item-image" src="${
      this.#state.image.medium
    }" alt="${this.#state.name}"/>

    <div class="shows__list__item-info">
        <div class="shows__list__item-head shows__list__item-info-point">
            <div>${String(genres).replaceAll(",", ", ")}</div>
            <div class="shows__list__item-rating">${
              this.#state.rating.average
            }</div> 
        </div>
        
        <h2 class="shows__list__item-info-point">${this.#state.name}</h2>
        
        <p class="shows__list__item-info-point">Premier: ${this.#state.premiered.replaceAll(
          "-",
          "."
        )}</p>
        
        <p class="shows__list__item-description shows__list__item-info-point">
            ${this.editText(this.#state.summary)}
        </p>
        <div class="shows__list__item-head">
            <span class="${statusClasses}">${this.#state.status}</span>
            <a href='#' class="shows__list__item-more">Read More &#8594;</a>    
        </div>

    </div>
    
    `;
  }

  render() {
    return this.#li;
  }
}
