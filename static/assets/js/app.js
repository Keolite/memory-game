const Skin =  {
    placeBackground: function(order, selector){
        const  elements = document.querySelectorAll(selector);
       for( let i = 0; i < elements.length; i++){
           elements[i].style.backgroundPositionY = `-${order[i] * 100 }px`;
       }

    }
}



const Board = {

    _props : {
        numberOfPair : 0,
        orderCards: []
    },

    _selector : {
        buttonPlay : document.getElementById('play'),
        gameBoard: document.getElementById('game-board'),
        screenCommon: document.getElementById('screen-common')
    },

    generateBoard: function( numberOfPair ){
        this._props.numberOfPair = numberOfPair;
        this.generateOrderCards();
        this.randomOrderCards();
        this.placeBackgroundPicture();
        this.generateEvents();
    },

    generateOrderCards: function(){
            let listCards = [...Array(this._props.numberOfPair).keys()];
            listCards = listCards.concat( listCards );
            this._props.orderCards = listCards;
    },


    randomOrderCards: function(){
        this._props.orderCards.sort(() => Math.random() - 0.5);
    },


    placeBackgroundPicture: function(){
        const skinBackground = Object.create(Skin);
        skinBackground.placeBackground(this._props.orderCards, '.card-back');

    },

    generateEvents : function(){
        this._selector.buttonPlay.addEventListener('click',  this.play.bind(this), false);
        this._selector.gameBoard.addEventListener('click', this.choice.bind(this), true);
    },

    play: function(e){
        this._selector.screenCommon.classList.add('close');
    },

    choice: function(e){

        const nodes = document.querySelectorAll('#game-board > .card > .card-inner > .card-front ');
        console.log(nodes);
        console.log([].indexOf.call(nodes, e.target));
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
         numberOfPair : 14
    },

    init : function(){

        const gameOnAir = Object.create(Board);
        gameOnAir.generateBoard( this._options.numberOfPair );

    }
}


 // Appel de la méthode init de l'objet Game
 Game.init();