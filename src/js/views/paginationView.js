import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    let markup = '';
    // Min number of pages after which (1 2 3 4 ... 7) pattern applies
    const minPageLimit = 6;
    // 1 2 3 4 ... 25 or 1 ... 22 23 24 25 (for maxPagesTogether = 4)
    const maxPagesTogether = 4;
    // console.log(this._data);

    // If only one page no pagination
    if (numOfPages === 1) {
      return markup;
    }

    // Generate previous button
    markup += this._generatePrevNextButton('prev', curPage - 1, numOfPages);

    // Generate button for each page (numOfPages)
    // for (let i = 1; i <= numOfPages; i++) {
    //   markup += this._generateMarkupButton(i, curPage);
    // }

    // Generate Pagination Pattern (1... 5 6 7 ... 11)
    markup += this._generatePaginationPattern(
      curPage,
      numOfPages,
      minPageLimit,
      maxPagesTogether
    );

    // Generate next button
    markup += this._generatePrevNextButton('next', curPage + 1, numOfPages);
    return markup;
  }
  _generatePaginationPattern(
    curPage,
    numOfPages,
    minPageLimit,
    maxPagesTogether
  ) {
    let markup = '';
    // 1 2 3 4 ... 25
    if (curPage - maxPagesTogether < 1) {
      if (numOfPages > minPageLimit) {
        // render 1-4 (for maxPagesT = 4)
        for (let i = 1; i <= maxPagesTogether; i++) {
          markup += this._generateMarkupButton(i, curPage);
        }
        // ...
        markup += `<span class='pagination__dots'>...</span>`;
        // last
        markup += this._generateMarkupButton(numOfPages, curPage);
      } else {
        // render 1-last
        for (let i = 1; i <= numOfPages; i++) {
          markup += this._generateMarkupButton(i, curPage);
        }
      }
    }
    // 1 ... 22 23 24 25
    else if (curPage + maxPagesTogether > numOfPages) {
      if (numOfPages > minPageLimit) {
        // render 1
        markup += this._generateMarkupButton(1, curPage);
        // ...
        markup += `<span class='pagination__dots'>...</span>`;
        // last-3 -2 -1 last (for maxPagesTogether = 4)
        for (
          let i = numOfPages - (maxPagesTogether - 1);
          i <= numOfPages;
          i++
        ) {
          markup += this._generateMarkupButton(i, curPage);
        }
      } else {
        // render 1-last
        for (let i = 1; i <= numOfPages; i++) {
          markup += this._generateMarkupButton(i, curPage);
        }
      }
    }
    // 1 ... 12 13 14 ... 25
    // curPage = 13 (e.g)
    else {
      if (numOfPages > minPageLimit) {
        // render 1
        markup += this._generateMarkupButton(1, curPage);
        // ...
        markup += `<span class='pagination__dots'>...</span>`;
        // -1 cur +1
        for (let i = curPage - 1; i <= curPage + 1; i++) {
          markup += this._generateMarkupButton(i, curPage);
        }
        // ...
        markup += `<span class='pagination__dots'>...</span>`;
        // last
        markup += this._generateMarkupButton(numOfPages, curPage);
      } else {
        // render 1-last
        for (let i = 1; i <= numOfPages; i++) {
          markup += this._generateMarkupButton(i, curPage);
        }
      }
    }

    return markup;
  }
  _generatePrevNextButton(type, page, total) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--${type} ${
      type === 'prev' && page <= 0
        ? 'hidden'
        : type === 'next' && page > total
        ? 'hidden'
        : ''
    }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${
      type === 'prev' ? 'left' : 'right'
    }"></use>
        </svg>
      </button>
    `;
  }
  _generateMarkupButton(page, cur) {
    return `
        <button data-goto="${page}" class="btn--inline ${
      cur === page ? 'btn--active' : ''
    }">
          ${page}
        </button>
    `;
  }
  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
