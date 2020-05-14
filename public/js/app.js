/// Cette fonction va envoyer au serveur le temps en milliseconde passé à joué si la personne à gagné
/// @param {Number} duration - Différence en milliseconde entre le temps du jeu et le temps écoulé
async function sendTimeToServer(duration){
    let response = await fetch(`/score/add/${duration}`);
    let data = await response.json();
}

/// Cette fonction fait une requête au serveur pour récupérer la liste des trois meilleurs score
/// Cette liste sera envoyer à l'objet Skin pour mettre à jout la liste à l'écran
function listScore( element ){
    fetch(`/score`)
        .then( function( response ){
            return response.json();
        }
    ).then( function( data ){
        skin =  Object.create(Skin);
        skin.updateScore(data, element );
    })


}


/// Cet objet va gérer l'apparence des écrans du jeu
const Skin =  {

    /// Message qui vont s'afficher sur l'écran d'accueil avant de rejouer, gagné ou perdu

    _message:{
        win: 'Tu as gagné(e) !!!',
        loose: 'Tu as perdu(e) !!!',
        labelBtn: 'Rejouer'
    },


    ///Positionne les cartes du jeu en arrière plan d'après l'ordre aléatoire. Elle est appelé depuis l'objet Board
    /// @param {Array} order - Tableau contenant l'ordre des image à placer
    /// @param {selector } ElementHTML - Eléménts HTML sur lesquels on va placer l'image en arrière plan
    placeBackground: function(order, selector){
        const  elements = document.querySelectorAll(selector);
       for( let i = 0; i < elements.length; i++){
           elements[i].style.backgroundPositionY = `-${order[i] * 100 }px`;
       }

    },

    ///Modifie la longueur de la prgresse bar et change sa couleur en fonction de sa longueur
    /// @param {Number} startValue - Nombre en millisecond du temps total du jeu
    /// @param {Number} realValue - Nombre en millisecond du temps restant
    /// @param {ElementHTML} realValue - ElementHTML à mdofier
    changeProgressBar: function( realValue, startValue, element ){
        const percentLength = Math.floor( realValue/ startValue * 100 );
        element.firstElementChild.style.width = `${percentLength}%`;


        if ( percentLength < 30 ) {
            element.firstElementChild.classList.add('end')   ;
        }else if( percentLength < 60 ){
            element.firstElementChild.classList.add('middle')   ;
        }

    },

    ///Modifie les messages de l'écran jouer ou rejouer
    /// @param {Boolean} stateWin - Contien vrai ou faux poir indiquer si la personne à gagné ou perdue
    /// @param {ElementHTML} realValue - ElementHTML à modifier
    message: function( stateWin, element ){
        const wichMessage = (stateWin)? this._message.win : this._message.loose;
        const wichIcon = (stateWin)? 'win': 'loose';
        element.innerText = wichMessage;
        element.classList.add(wichIcon);
    },


    ///Modifie le message du bouton jouer en rejouer
    /// @param {ElementHTML} element - ElementHTML à modifier
     labelButton: function(element){
        element.innerText = this._message.labelBtn;
    },


    ///Réinitialise la barre de progression en fin de jeu
    /// @param {ElementHTML} element - ElementHTML à modifier
    resetProgressBar: function(element){
        element.firstElementChild.classList.remove('end', 'middle');
        element.firstElementChild.style.width = 'auto';
    },


    ///Retourne toutes les cartes en fin de jeu
    /// @param {ElementHTML} element - ElementHTML à modifier
    resetCards: function(elements){
        for( let element of elements ){
            element.parentElement.classList.remove('back')
        }
    },

    ///Remet à jour la liste des trois meilleurs score
    /// @param {JSON} newScore - Liste des trois meilleurs score
    /// @param {ElementHTML} element - ElementHTML à modifier
    updateScore: function(newScore, element){

        while(element.firstElementChild){
            element.removeChild(element.firstElementChild);
        }

        for(let i = 0; i < newScore.length; i++ ){
            const  node = document.createElement("LI");
            const  dateGame = new Date(newScore[i].dateGame);
            const  year = dateGame.getFullYear();
            const  month = ("0" + (dateGame.getMonth() + 1)).slice(-2);
            const  day = ("0" + dateGame.getDate()).slice(-2);
            const minutes = ("0" + Math.floor( newScore[i].duration / 60000) ).slice(-2) ;
            const secondes = ("0" +  (newScore[i].duration % 60000) / 1000 ) .slice(-2);
            const textnode = document.createTextNode(`${day}-${month}-${year} - ${minutes}" ${secondes}`);
            node.appendChild(textnode);
            node.setAttribute("data-duration", newScore[i].duration);
            element.appendChild(node);
        }

    },
}



const Board = {

    /// Ces propriétés sont modifiés au démarrage du jeu
    /// numberOfPair - Contient le nombre de pair de carte à trouver
    /// timing - Contient en milliseconde le temps du jeu
    _props : {
        numberOfPair : 0,
        timing : 0,
    },

    /// Ces propriétés seront  modifiés durant le jeux
    /// state - Le nombre de click qui ne doit pas dépasser 2
    /// index - La position et la valeur de la carte cliquée
    _clicks: {
        state : 0,
        index: {
            0: null,
            1: null
        }
    },

    /// Ces propriétés seront  modifiés durant le jeux
    /// orderCards - contient l'ordre des cartes à trouver
    /// numberPairFind - contient le nombre de pair trouvée durant la partie
    _cards:{
        orderCards: [],
        numberPairFind : 0
    },

    /// Ces propriétés seront  modifiés durant le jeux
    /// realValue - contient le temps restant à jouer
    _chrono: {
        realValue : 0,
        chrono: null
    },


    /// Selecteur des éléments HTML à modifier pendant le jeu
    _selector : {
        buttonPlay : document.getElementById('play'),
        gameBoard: document.getElementById('game-board'),
        screenCommon: document.getElementById('screen-common'),
        frontCards:  document.querySelectorAll('.card-front'),
        progressBar: document.getElementById('progress'),
        greatTitle: document.querySelector('h1'),
        score: document.getElementById('score')
    },

    /// Cette fonction va iniatialiser le jeu au chargement de la page - Met à jour les proriété du jeu et les sélecteur des éléments HTML
    /// @param {JSON} options - Contient le nombre pair de carte à trouver et le temps pour jouer
    generateBoard: function( options ){
        this._props = options;
        this._cards.orderCards = [];
        this.prepareBoard();
        this.generateEvents();
    },


    /// Cette fonction met en place le plateau de jeu
    prepareBoard: function(){
        this.generateOrderCards();
        this.randomOrderCards();
        this.placeBackgroundPicture();
    },

    /// Cette fonction génére un tableau contenant les positions des carte du plus petit au plus grand
    generateOrderCards: function(){
            let listCards = [...Array(this._props.numberOfPair).keys()];
            listCards = listCards.concat( listCards );
            this._cards.orderCards = listCards;
    },

    /// Cette fonction va trier la position des cartes aléatoirement
    randomOrderCards: function(){
        this._cards.orderCards.sort(() => Math.random() - 0.5);
    },

    /// Cette fonction va placer les images dans les bon elements HTML
    placeBackgroundPicture: function(){
        const skinBackground = Object.create(Skin);
        skinBackground.placeBackground(this._cards.orderCards, '.card-back');

    },

    /// Cette fonction ajoute les événement au bouton jouer et lorsque l'on clique sur une carte retournée
    generateEvents : function(){
        this._selector.buttonPlay.addEventListener('click',  this.play.bind(this), false);
        this._selector.gameBoard.addEventListener('click', this.choice.bind(this), true);
    },

    /// Cette fonction affiche le plateau du jeu quand la personne clique sur jouer ou rejouer. Le chrono est déclenché
    play: function(e){
        this._selector.screenCommon.classList.add('close');
        setTimeout(function(){
            this._chrono.realValue = this._props.timing;
            this.startChrono();
        }.bind(this), 1000);
    },

    /// Déclenchement du chrono en décomptant en seconde de milliseconde
    startChrono: function(){
        this._chrono.chrono = setInterval( function(){
            this.chronoInProgress();
        }.bind(this), 1000)
    },

    /// Mise à jour de la barre de progression. Si le temps est écoulé on arrête le jeu
    chronoInProgress: function(){
        this._chrono.realValue -= 1000;
        const skinProgress = Object.create(Skin);
        skinProgress.changeProgressBar(this._chrono.realValue, this._props.timing, this._selector.progressBar);

        if( this._chrono.realValue < 1 ){
            clearInterval(this._chrono.chrono);
            this.stopGame();
        }


    },


    /// Fonction qui capte l'élément de la carte retourné cliqué par l'utilisateur
    /// Si 1 click on stok l'index de l'élément cliqué
    /// Si deux clic on compare les numéro de carte si identique alors on compte une paire trouvée
    /// On vérifie aussi si la persone à gagnée
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


    ///Incrémente le nombre de click
    permissionClick : function(index){
        this._clicks.state++;
        this._clicks.index[ this._clicks.state - 1 ] = index;
    },


    /// Vérifie le nombre de pair
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


    ///Réinitailise le nombre de click si égale a deux
    resetClick: function(){

        if( this._clicks.state < 2 ){
            return;
        }

        this._clicks.state = 0;
    },


    /// Vérifie si le nombre pair trouvé et égale au nombre de pair total à trouver et arrête le jeu si oui
    verifWin: function(){

        if( this._cards.numberPairFind !== this._props.numberOfPair){
            return;
        }


        this.stopGame();


    },

    ///Arrête le jeu et on refais toute les réinitailisation du jeu
    ///On affiche si gagné ou perdu
    stopGame:  function(){
        let win = false;

        if( this._cards.numberPairFind === this._props.numberOfPair){
            win = true;
            clearInterval(this._chrono.chrono);
            sendTimeToServer(this._props.timing - this._chrono.realValue);
            listScore(this._selector.score);
        }


        const skin = Object.create(Skin);
        skin.message( win,  this._selector.greatTitle );
        skin.labelButton(this._selector.buttonPlay);

        setTimeout(function(){
            this.reset(win);
        }.bind(this) , 1000);


    },

    ///Réinitialise tous les écran du jeu et les paramètres
    reset: function(win){

        this.displayScreenCommon(win );
        this._chrono.realValue = this._props.timing;
        this._clicks.state = 0;
        this._cards.numberPairFind  = 0;
        const skin = Object.create(Skin);
        skin.resetProgressBar( this._selector.progressBar );
        skin.resetCards( this._selector.frontCards);
        this.prepareBoard();


    },

    ///Affiche l'écran gagné ou perdu
    displayScreenCommon: function(){
        this._selector.screenCommon.classList.remove('close');
    }




}







//Objet literal contenant les options du jeu
// Cet objet va transmettre les options à l'objet literal Board
const Game = {

    //Option du jeu que l'utilisateur peut modifier
    // Attention le nombre de pair ne changera pas le plateau mais le nombre de pair à trouver uniqueement pour faciliter le niveau
    /// @param {Number} numberOfPair - Nombre de paire de carte à trouver
    /// @param {Number} - timing - Temps en milliseconde du jeu
    _options : {
        numberOfPair : 14,
        timing : 150000
    },

    // Cette fonction va instancier l'objet Board et générer le plateau de jeu
    init : function(){

        ///Instancier l'objet Board
        const gameOnAir = Object.create(Board);

        ///Appel la méthode generateBoard de l'objet Board
        gameOnAir.generateBoard( this._options  );

    }
}


 // Appel de la méthode init de l'objet Game
 // Elle va initialiser le jeu
 Game.init();