import icons from 'url:../../img/icons.svg';
import View from "./View";

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');
    _errorMessage = 'No recipes found for your query! Please try again.';
    _message = '';

    addHandlerClickBtn(handler){
        this._parentElement.addEventListener('click', function (event){
            const clickedBtn = event.target.closest('.btn--inline');
            if (!clickedBtn) return;
            const goToPage = Number(clickedBtn.dataset.goto);
            handler(goToPage);
        })
    }

    _generateMarkup() {
        const amountPages = Math.ceil(this._data.recipes.length / this._data.resultPerPage);
        const currentPage = this._data.currentPage;

        // Page 1 and there are more additional pages
        if (currentPage === 1 && amountPages > 1)
            return this._generateMarkupNextBtn(currentPage);

        // Next page and that is not the last page
        if (currentPage !== 1 && currentPage < amountPages)
            return this._generateMarkupPreviousBtn(currentPage) + this._generateMarkupNextBtn(currentPage);

        // Previous page and that is the last page
        if (currentPage === amountPages && amountPages > 1)
            return this._generateMarkupPreviousBtn(currentPage);

        // Page 1 and no more pages
        return '';
    }

    _generateMarkupNextBtn(currentPage){
        return `
              <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
                <span>Page ${currentPage + 1}</span>
              </button>`;
    }

    _generateMarkupPreviousBtn(currentPage){
        return `
              <button data-goTo="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>`;
    }
}

export default new PaginationView();
