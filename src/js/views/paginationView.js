import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    // console.log(this._data);
    // Page 1 and there are other pages
    if (curPage === 1 && numOfPages > 1) {
      //   return '1st page, others';
      // show only next button
      return this._generateMarkupButton('next', curPage + 1);
    }
    // Last page
    if (curPage === numOfPages && numOfPages > 1) {
      // show only previous button
      return this._generateMarkupButton('prev', curPage - 1);
    }
    // Other page
    if (curPage < numOfPages && curPage > 1) {
      //   return 'other page';
      // show previous and next button
      return (
        this._generateMarkupButton('next', curPage + 1) +
        this._generateMarkupButton('prev', curPage - 1)
      );
    }
    // Page 1 and there are NO other pages
    return '';
  }
  _generateMarkupButton(type, page) {
    return `
        <button data-goto="${page}" class="btn--inline pagination__btn--${type}">
            ${type === 'next' ? `<span>Page ${page}</span>` : ''}
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${
      type === 'prev' ? 'left' : 'right'
    }"></use>
            </svg>
            ${type === 'prev' ? `<span>Page ${page}</span>` : ''}
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
