import icons from 'url:../../img/icons.svg';
import View from "./View";
import PreviewView from "./previewView";

class ResultView extends View{
    _parentElement = document.querySelector('.results');
    _errorMessage = 'No recipes found for your query! Please try again.';
    _message = '';

    _generateMarkup(){
        return this._data.map(result => PreviewView.render(result, false)).join('');
    }
}

export default new ResultView();