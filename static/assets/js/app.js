const Skin =  {

    _message:{
        win: 'Tu as gagné(e) !!!',
        loose: 'Tu as perdu(e) !!!',
        labelBtn: 'Rejouer'
    },

    placeBackground: function(order, selector){
        const  elements = document.querySelectorAll(selector);
       for( let i = 0; i < elements.length; i++){
           elements[i].style.backgroundPositionY = `-${order[i] * 100 }px`;
       }

    },

    changeProgressBar: function( realValue, startValue, element ){
        const percentLength = Math.floor( realValue/ startValue * 100 );
        element.firstElementChild.style.width = `${percentLength}%`;


        if ( percentLength < 30 ) {
            element.firstElementChild.classList.add('end')   ;
        }else if( percentLength < 60 ){
            element.firstElementChild.classList.add('middle')   ;
        }

    },

    message: function( stateWin, element ){
        const wichMessage = (stateWin)? this._message.win : this._message.loose;
        const wichIcon = (stateWin)? 'win': 'loose';
        element.innerText = wichMessage;
        element.classList.add(wichIcon);
    },

    labelButton: function(element){
        element.innerText = this._message.labelBtn;
    },

    resetProgressBar: function(element){
        element.firstElementChild.classList.remove('end', 'middle');
        element.firstElementChild.style.width = 'auto';
    },

    resetCards: function(elements){
        for( let element of elements ){
            element.parentElement.classList.remove('back')
        }
    }


}



const Board = {

    _props : {
        numberOfPair : 0,
        timing : 0,
    },

    _clicks: {
        state : 0,
        index: {
            0: null,
            1: null
        }
    },

    _cards:{
        orderCards: [],
        numberPairFind : 0
    },

    _chrono: {
        realValue : 0,
        chrono: null
    },

    _selector : {
        buttonPlay : document.getElementById('play'),
        gameBoard: document.getElementById('game-board'),
        screenCommon: document.getElementById('screen-common'),
        frontCards:  document.querySelectorAll('.card-front'),
        progressBar: document.getElementById('progress'),
        greatTitle: document.querySelector('h1')
    },

    generateBoard: function( options ){
        this._props = options;
        this._cards.orderCards = [];
        this.prepareBoard();
        this.generateEvents();
    },

    prepareBoard: function(){
        this.generateOrderCards();
        this.randomOrderCards();
        this.placeBackgroundPicture();
    },

    generateOrderCards: function(){
            let listCards = [...Array(this._props.numberOfPair).keys()];
            listCards = listCards.concat( listCards );
            this._cards.orderCards = listCards;
    },


    randomOrderCards: function(){
        this._cards.orderCards.sort(() => Math.random() - 0.5);
    },


    placeBackgroundPicture: function(){
        const skinBackground = Object.create(Skin);
        skinBackground.placeBackground(this._cards.orderCards, '.card-back');

    },

    generateEvents : function(){
        this._selector.buttonPlay.addEventListener('click',  this.play.bind(this), false);
        this._selector.gameBoard.addEventListener('click', this.choice.bind(this), true);
    },

    play: function(e){
        this._selector.screenCommon.classList.add('close');
        setTimeout(function(){
            this._chrono.realValue = this._props.timing;
            this.startChrono();
        }.bind(this), 1000);
    },

    startChrono: function(){
        this._chrono.chrono = setInterval( function(){
            this.chronoInProgress();
        }.bind(this), 1000)
    },

    chronoInProgress: function(){
        this._chrono.realValue -= 1000;
        const skinProgress = Object.create(Skin);
        skinProgress.changeProgressBar(this._chrono.realValue, this._props.timing, this._selector.progressBar);

        if( this._chrono.realValue < 1 ){
            clearInterval(this._chrono.chrono);
            this.stopGame();
        }

        console.log(this._chrono.realValue);
    },

    choice: function(e){

        if( !e.target.classList.contains('card-front')){
            return;
        }

        const index = [].indexOf.call(this._selector.frontCards, e.target);
        const parentCard = e.target.parentElement;


        if( this._clicks.state > 2 || parentCard.classList.contains('back') ) {
            return;
        }



        parentCard.classList.add('back');
        this.permissionClick(index);
        this.findPair();
        this.resetClick();
        this.verifWin();
    },

    permissionClick : function(index){
        this._clicks.state++;
        this._clicks.index[ this._clicks.state - 1 ] = index;
    },


    findPair: function(){

        if( this._clicks.state < 2 ){
            return;
        }

        if( this._cards.orderCards[this._clicks.index[0]] !== this._cards.orderCards[this._clicks.index[1]]){
            setTimeout( function(){
                this._selector.frontCards[this._clicks.index[0]].parentElement.classList.remove('back');
                this._selector.frontCards[this._clicks.index[1]].parentElement.classList.remove('back');
            }.bind(this), 300);

            return;
        }


        this._cards.numberPairFind++;

    },

    resetClick: function(){

        if( this._clicks.state < 2 ){
            return;
        }

        this._clicks.state = 0;
    },

    verifWin: function(){

        if( this._cards.numberPairFind !== this._props.numberOfPair){
            return;
        }

        this.stopGame();

    },

    stopGame: function(){
        let win = false;

        if( this._cards.numberPairFind === this._props.numberOfPair){
            win = true;
        }

        const skin = Object.create(Skin);
        skin.message( win,  this._selector.greatTitle );
        skin.labelButton(this._selector.buttonPlay);

        setTimeout(function(){
            this.reset(win);
        }.bind(this) , 2000);


    },

    reset: function(win){
        this.displayScreenCommon(win );
        this._chrono.realValue = this._props.timing;
        this._clicks.state = '00';
        this._cards.numberPairFind  = 0;
        skin = Object.create(Skin);
        skin.resetProgressBar( this._selector.progressBar );
        skin.resetCards( this._selector.frontCards);
        this.prepareBoard();


    },

    displayScreenCommon: function(){
        this._selector.screenCommon.classList.remove('close');
    }




}


//
//     _options : {
//         numberOfPair : 14,
//         placeOfEachPicture: null
//     },
//
//     definePicturePlace: function() {
//         let picturePlace = [...Array(this.options.numberOfPair).keys()];
//         picturePlace = picturePlace.concat( picturePlace);
//         shuffle(picturePlace);
//     },
//
//     generateBoard: function(){
//         this.options.placeOfEachPicture = this.definePicturePlace();
//     },
//
//     init: function() {
//         Skin.screenCommonClose();
//         this.generateBoard();
//     }






const Game = {

    _options : {
        numberOfPair : 14,
        timing : 180000
    },

    init : function(){

        const gameOnAir = Object.create(Board);
        gameOnAir.generateBoard( this._options  );

    }
}


 // Appel de la méthode init de l'objet Game
 Game.init();