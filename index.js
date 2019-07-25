;
const API_KEY = '68a438de4575e3736b8a5fae8d9e3939';

/**
 * Вызвывается кликом в index.html. Содержит метод fetch(), который обращается к серверу
 * с введеными в input данными и получает ответ в JSCN формате. После получения создается экземпляр
 * класса Viewer, куда передается response и сразу вызывается метод render для отрисовки сожержимого
 *
 * @param {string} API_KEY - получаем ключ API полученный с https://mailboxlayer.com/dashboard
 * @param {string} document.getElementById('email').value - получаем значения поля с id: email
*/
const check = function () {
    fetch(`https://apilayer.net/api/check?access_key=${API_KEY}&email=${document.getElementById('email').value}&smtp=1&format=1`)
        .then(response => response.json())
        .then(data => {
            new Viewer(data).render();
        })
        .catch(error => console.error(error));
};


/**
 * Класс для отображения полученных с сервера данных.
 *
 * Изначально происходит проверка поля format_valid. Если значение свойства === true - данные коректны, false - данные некоректны. Однако этого свойства может и не быть в случае отсутствия данных
 * или проблемы соединения с сервером.
 * В этом случае свойству this.card присваевается значение для карточки ошибки. Свойству this.status вешается значение Error.
 *
 * После проверки последовательно отрисовываются блоки и выводим данные.
 *
 * @param {Object} result - принимает объект для дальнейшего отображения
 * @param {boolean} this.result.format_valid - значение валидации введенных данных
 * @param {string} this.card - данному свойству присваевается имя класса куда будут выводиться данные в зависимости от результата запроса
 * @param {string} this.status - шапка для карточки;
 *
 *
 *
* */
class Viewer {

    constructor(result){
        this.result=result;

        if (this.result.format_valid === true) {
            this.card = 'card text-white bg-success text-center';
            this.status = 'Success';
        }
        else if (this.result.format_valid === false) {
            this.card = 'card text-white bg-warning text-center';
            this.status = 'Warning';
        }
        else {
            this.card = 'card text-white bg-danger text-center';
            this.status = 'Error';
        }

    }
    /**
     * render - метод для последовательной отрисовки блоков, данных полученных с сервера. Перед началом отрисовки стоит проерка существования
     * карточки. Если есть - карточка удалаяется.
     *
     * @example
     *
     *     if(document.getElementById('card')) {
            document.getElementById('card').remove();
        }

     *
    * */
    render(){

        if(document.getElementById('card')) {
            document.getElementById('card').remove();
        }

        let inn = document.createElement('div');
        inn.setAttribute('class',this.card);
        inn.setAttribute('id','card');
        document.querySelector('#center').appendChild(inn);

        inn = document.createElement('div');
        inn.setAttribute('class','card-header');
        document.querySelector('#card').appendChild(inn);

        inn = document.createElement('h5');
        inn.setAttribute('class','card-title');
        inn.innerHTML = this.status;
        document.querySelector('.card-header').appendChild(inn);

        inn = document.createElement('div');
        inn.setAttribute('class','card-body');
        inn.setAttribute('id','results');
        document.querySelector('#card').appendChild(inn);

        for (let key in this.result){
            let inn = document.createElement('p');
            inn.innerHTML = `${key.toUpperCase().bold()}:  ${this.result[key]} `;
            document.querySelector('#results').appendChild(inn)
        }
    }


}