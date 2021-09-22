class CalcController{

    constructor(){//ATRIBUTOS
        this._operation = [];
        this.locale = 'pt-BR'//Criado pois irá usar varias vezes
        this._displayCalcEl = document.querySelector("#display")
        this._dataEl = document.querySelector("#data")
        this._timeEl = document.querySelector("#hora")
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        //this.addEventListenerAll();
    }

    //Inicia a função da data e horas
    initialize(){
       setInterval(() =>{
           this.setDisplayDateTime();   
       }, 1000)
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false)
        });
    }

    clearAll(){
        this._operation = [];
    }

    clearEntry(){
        this._operation.pop();

    }

    addOperation(value){
        this._operation.push(value);

        console.log(this._operation);
    }

    setError(){
        this.displayCalc = "Error";
    }

    execBtn(value){

        switch(value){

            case "ac":
                this.clearAll();
            break;

            case "ce":
                this.clearEntry();
            break;

            case "soma":
                this.somar();
            break;

            case "subtracao":
                this.somar();
            break;

            case "divisao":
                this.somar();
            break;

            case "multiplicacao":
                this.somar();
            break;

            case "porcento":
                this.somar();
            break;

            case "igual":
                this.somar();
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
                let textBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            })
        })
    }

    //Função da date e hora já formatada
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this.locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"})
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
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
}

