class SearchView{
    #parentElement = document.querySelector('.search');

    #clear(){
        this.#parentElement.querySelector('.search__field').value = '';
    }
    getQuery(){
        const query = this.#parentElement.querySelector('.search__field').value;
        this.#clear();
        return query;
    }
    addHandlerSearch(handler){
        this.#parentElement.addEventListener('submit', function(event){
            event.preventDefault();
            handler();
        });
    }

}

export default new SearchView();