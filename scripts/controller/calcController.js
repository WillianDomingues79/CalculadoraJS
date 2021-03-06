class CalcController {

    constructor() {//ATRIBUTOS
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;

        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this.locale = 'pt-BR'//Criado pois irá usar varias vezes
        this._displayCalcEl = document.querySelector("#display")
        this._dataEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
        //this.addEventListenerAll();
    }

    //Função colar
    pasteFromClipboard(){
        document.addEventListener('paste', e =>{
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

            console.log(text)
        })
    }

    //Função copiar
    copyToClipboard(){
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("copy");

        input.remove();
    }

    //Inicia a função da data e horas
    initialize() {
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000)

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e=>{
                this.toogleAudio();
            })
        })

    }

    //audio
    toogleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    //Função para receber as coisas e criar um array de Strings
    //A string seria o "click drag" que tem logo ali abaixo
    //events.split(' ') -> faz a separação das strings para cada um ser um elemento
    //forEach -> Para poder receber essa separação das string e criar um array
    //Necessário fazer assim pois só consegue escutar um elemento por vez
    addEventListenerAll(element, events, fn) {//Recebe o elemento, o evento(click) e a função
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false)
        });
    }
    
    initKeyboard(){
        document.addEventListener('keyup', e=>{
            console.log(e.key);

            this.playAudio();

            switch(e.key){
                case "Escape":
                    this.clearAll();
                break;
                case "Backspace":
                    this.clearEntry();
                break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key);
                break;
                case "Enter":
                case "=":
                    this.calc();
                break;
                case ".":
                case ",":
                    this.addDot();
                break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(e.key);
                break;

                case "c":
                    if (e.ctrlKey) this.copyToClipboard();
                break;

            }
        });
    }

    //Apaga tudo
    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    //Apaga a ultima entrada
    clearEntry() {
        this._operation.pop();

        this.setLastNumberToDisplay();

    }

    //Pega o ultimo valor do array pelo Lenght
    getlastOperation() {
        return this._operation[this._operation.length - 1];
    }

    //Função para pegar o ultimo numero do array, SÓ PEGAR
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    //Verifica se é um operador se for é TRUE senão é FALSE
    //Lembrando que os sinais strings são os mesmo que estão nos IDs dos botões
    //Se for mais que -1 é um operador, porque no array o + é o [0] e assim por diante
    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    //Função para verificar se já passou de 2 numeros para fazer a operação requerida
    //..(manda 2 numeros soma e mostra resultado e depois vai para o próximo)
    pushOperation(value) {
        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult(){
        try{
            return eval(this._operation.join(""));
            //Eval faz somar independente se o sinal for uma string
            //E usa o join para poder tirar as virgulas da separação do array dos numeros
        }catch(e){
            setTimeout(() =>{
                this.setError();
            }, 1)
        }
    }

    //Faz a soma de fato
    calc() {
        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop();//retira o ultimo numero para ficar so com 2 para somar
            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3){
            //last = this._operation.pop();//retira o ultimo numero para ficar so com 2 para somar
            this._lastNumber = this.getLastItem(false);
        }

        console.log('_lastOperator', this._lastOperator);
        console.log('_lastNumber', this._lastNumber);

        let result = this.getResult();
        
        if (last == '%'){
            result /= 100;

            this._operation = [result];

        }else{
            
            this._operation = [result];
            if(last) this._operation.push(last)
        }
        
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            
                if (this.isOperator(this._operation[i]) == isOperator) {
                    lastItem = this._operation[i];
                    break;
                }

            
            if(!lastItem){
                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
            }
            
        }
        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);


        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    
}

//Adiciona o operador no final da expressão, ou seja separa a expressão para 
//..salvar os numeros e depois fazer a conta, para não ficar somando a cada apertar
//..tipo 102 e não 12
//Se quando enquanto a tecla for apertada não for um numero faça
addOperation(value){
    console.log("aa", value, this.getlastOperation)
    if (isNaN(this.getlastOperation())) {
        //string
        if (this.isOperator(value)) {
            //trocar o operador
            this.setLastOperation(value);

        } else {
            this.pushOperation(value);
            this.setLastNumberToDisplay();
        }

    } else {//Esta convertendo para string tudo e jogando no push os numeros, para não somar 102 e não 12
        if (this.isOperator(value)) {
            this.pushOperation(value);
        } else {
            let newValue = this.getlastOperation().toString() + value.toString();
            this.setLastOperation(newValue);
            //atualizar display
            this.setLastNumberToDisplay();
        }


    }

    console.log(this._operation);
}

//Verifica se tem erro na calculadora
setError(){
    this.displayCalc = "Error";
}

addDot(){
    let lastOperation = this.getlastOperation();

    if(typeof lastOperation == 'string' && lastOperation.split('').indexOf('.') > -1) return;

    console.log(lastOperation)
    if (this.isOperator(lastOperation) || !lastOperation) {
        this.pushOperation('0.');
    }else {
        this.setLastOperation(lastOperation.toString() + '.');
    }
    this.setLastNumberToDisplay();
}

//Chama as funções para cada botão que for pressionado
execBtn(value){

    this.playAudio();

    switch (value) {

        case "ac":
            this.clearAll();
            break;

        case "ce":
            this.clearEntry();
            break;

        //Se apertar o botão Somar que tem o texto soma como ID, alterar para mostrar no visor o sinal de + como uma string
        case "soma":
            this.addOperation('+');
            break;

        case "subtracao":
            this.addOperation('-');
            break;

        case "divisao":
            this.addOperation('/');
            break;

        case "multiplicacao":
            this.addOperation('*');
            break;

        case "porcento":
            this.addOperation('%');
            break;

        case "igual":
            this.calc();
            break;

        case "ponto":
            this.addDot();
            break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            this.addOperation(parseInt(value));
            //adiciona o value que recebeu do botão e converte para inteiro
            //Precisa ser feito desta forma pois o nome dos botões é uma string
            //E não teria como somar depois.
            break;

        default:
            this.setError();
            break
    }
}

//Evento do clique dos botoes
initButtonsEvents() {
    //Cria uma variavel para poder pegar todos os botoes pelo ID do DOM
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    //ForEach percorre o evento do click para quando ser clicado mostrar na tela já formatado
    buttons.forEach((btn, index) => {
        this.addEventListenerAll(btn, 'click drag', e => {
            //console.log(btn.className.baseVal.replace("btn-",""));
            let textBtn = btn.className.baseVal.replace("btn-", "");
            //Retira o btn- da formatação para poder trazer apenas o 9 ao inves de btn-9
            this.execBtn(textBtn);
            //chama a função do execBtn que chama as funções de fato.
        });

        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
            btn.style.cursor = "pointer";
        })
    })
}

//Função da date e hora já formatada
setDisplayDateTime(){
    this.displayDate = this.currentDate.toLocaleDateString(this.locale, {
        day: "2-digit",
        month: "long",
        year: "numeric"
    })
    this.displayTime = this.currentDate.toLocaleTimeString(this.locale)
}

    //Getters and Setters
    get displayTime(){
    return this._timeEl.innerHTML;
}

    set displayTime(value){
    this._timeEl.innerHTML = value;
}

    get displayDate(){
    return this._dataEl.innerHTML;
}

    set displayDate(value){
    this._dataEl.innerHTML = value;
}

    get displayCalc(){
    return this._displayCalcEl.innerHTML;
}

    set displayCalc(value){

        if(value.toString.length > 10) {
            this.setError();
            return false;
        }
    this._displayCalcEl.innerHTML = value;
}

    get currentDate(){
    return new Date();
}

    set currentDate(value){
    this._currentDate = value;
}
}

