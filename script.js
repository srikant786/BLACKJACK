var blackjack = {
    debug: true,

    hdstand: null,
    hdpoints: null,
    hdhand: null,
    hpstand: null,
    hppoints: null,
    hphand: null,
    hstart: null,
    hmove: null,

    deck: [],
    dealer: [],
    player: [],
    dpoints: 0,
    ppoints: 0,
    safety: 17,
    dstand: false,
    pstand: false,

    init: function() {

        blackjack.hdstand = document.getElementById("dealer-stand");
        blackjack.hdpoints = document.getElementById("dealer-points");
        blackjack.hdhand = document.getElementById("dealer-cards");
        blackjack.hpstand = document.getElementById("player-stand");
        blackjack.hppoints = document.getElementById("player-points");
        blackjack.hphand = document.getElementById("player-cards");
        blackjack.hstart = document.getElementById("player-start");
        blackjack.hmove = document.getElementById("player-move");

        document.getElementById("play-start").addEventListener("click", blackjack.start);
        document.getElementById("play-hit").addEventListener("click", blackjack.hit);
        document.getElementById("play-stand").addEventListener("click", blackjack.stand);

        if (blackjack.debug) { console.log("Game initialized - Ready"); }
    },

    start: function() {

        blackjack.deck = [];
        blackjack.dealer = [];
        blackjack.player = [];
        blackjack.dpoints = 0;
        blackjack.ppoints = 0;
        blackjack.dstand = false;
        blackjack.pstand = false;
        blackjack.hpstand.classList.add("soal");
        blackjack.hdstand.classList.add("soal");
        blackjack.hdpoints.innerHTML = "?";
        blackjack.hppoints.innerHTML = 0;
        blackjack.hdhand.innerHTML = "";
        blackjack.hphand.innerHTML = "";

        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 14; j++) {
                blackjack.deck.push({
                    s: i,
                    n: j
                });
            }
        }

        for (let i = blackjack.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = blackjack.deck[i];
            blackjack.deck[i] = blackjack.deck[j];
            blackjack.deck[j] = temp;
        }

        if (blackjack.debug) {
            console.log("Deck reshuffled");
            console.table(blackjack.deck);
        }

        blackjack.hstart.classList.add("soal");
        blackjack.hmove.classList.remove("soal");
        blackjack.draw(0);
        blackjack.draw(1);
        blackjack.draw(0);
        blackjack.draw(1);
        blackjack.points(0);
        blackjack.points(1);
        blackjack.check();
    },

    draw: function(target) {

        var card = blackjack.deck.pop();

        var symbol = ["&hearts;", "&diams;", "&clubs;", "&spades;"],
            number = card.n;
        if (card.n == 1) { number = "A"; }
        if (card.n == 11) { number = "J"; }
        if (card.n == 12) { number = "Q"; }
        if (card.n == 13) { number = "K"; }

        var drawing = document.createElement("div");
        drawing.classList.add("card");

        if (target && blackjack.dealer.length == 0) {
            var dealerFirstFront = document.createElement("div"),
                dealerFirstBack = document.createElement("div");
            dealerFirstFront.innerHTML = number + symbol[card.s];
            dealerFirstBack.innerHTML = "[HIDDEN]";
            dealerFirstFront.id = "dealer-first-f";
            dealerFirstBack.id = "dealer-first-b";
            dealerFirstFront.classList.add("soal");
            drawing.appendChild(dealerFirstFront);
            drawing.appendChild(dealerFirstBack);
        } else {
            drawing.innerHTML = number + symbol[card.s];
        }

        if (target) {
            blackjack.dealer.push(card);
            blackjack.hdhand.appendChild(drawing);
        } else {
            blackjack.player.push(card);
            blackjack.hphand.appendChild(drawing);
        }

        if (blackjack.debug) {
            console.log((target ? "Dealer" : "Player") + " has drawn - " + number + " " + symbol[card.s]);
        }
    },

    points: function(target) {

        var aces = 0,
            points = 0;
        for (let i of(target ? blackjack.dealer : blackjack.player)) {
            if (i.n == 1) { aces++; } else if (i.n >= 11 && i.n <= 13) { points += 10; } else { points += i.n; }
        }

        if (aces != 0) {
            var minmax = [];
            for (let elevens = 0; elevens <= aces; elevens++) {
                let calc = points + (elevens * 11) + (aces - elevens * 1);
                minmax.push(calc);
            }

            points = minmax[0];
            for (let i of minmax) {
                if (i > points && i <= 21) { points = i; }
            }
        }

        if (target) {
            blackjack.dpoints = points;
        } else {
            blackjack.ppoints = points;
            blackjack.hppoints.innerHTML = points;
        }

        if (blackjack.debug) {
            console.log((target ? "Dealer" : "Player") + " total points - " + points);
        }
    },

    check: function() {
        var winner = null,
            message = "";

        if (blackjack.player.length == 2 && blackjack.dealer.length == 2) {

            if (blackjack.ppoints == 21 && blackjack.dpoints == 21) {
                winner = 2;
                message = "It's a tie with Blackjacks";
            }
            if (winner == null && blackjack.ppoints == 21) {
                winner = 0;
                message = "Player wins with a Blackjack!";
            }
            if (winner == null && blackjack.dpoints == 21) {
                winner = 1;
                message = "Dealer wins with a Blackjack!";
            }
        }

        if (winner == null) {
            if (blackjack.ppoints > 21) {
                winner = 1;
                message = "Player has gone bust - Dealer wins!";
            }
            if (blackjack.dpoints > 21) {
                winner = 0;
                message = "Dealer has gone bust - Player wins!";
            }
        }

        if (winner == null && blackjack.dstand && blackjack.pstand) {
            if (blackjack.dpoints > blackjack.ppoints) {
                winner = 1;
                message = "Dealer wins with " + blackjack.dpoints + " points!";
            } else if (blackjack.dpoints < blackjack.ppoints) {
                winner = 0;
                message = "Player wins with " + blackjack.ppoints + " points!";
            } else {
                winner = 2;
                message = "It's a tie.";
            }
        }

        if (winner != null) {
            blackjack.hdpoints.innerHTML = blackjack.dpoints;
            document.getElementById("dealer-first-b").classList.add("soal");
            document.getElementById("dealer-first-f").classList.remove("soal");

            blackjack.hmove.classList.add("soal");
            blackjack.hstart.classList.remove("soal");

            alert(message);
        }

        return winner;
    },

    doHit: function(target) {

        blackjack.draw(target);
        blackjack.points(target);

        if (target == 0 && blackjack.ppoints == 21 && !blackjack.pstand) {
            blackjack.doStand(0);
        }
        if (target == 1 && blackjack.dpoints == 21 && !blackjack.dstand) {
            blackjack.doStand(1);
        }
    },

    doStand: function(target) {

        if (target) {
            blackjack.dstand = true;
            blackjack.hdstand.classList.remove("soal");
        } else {
            blackjack.pstand = true;
            blackjack.hpstand.classList.remove("soal");
        }
    },

    hit: function() {

        blackjack.doHit(0);

        var winner = blackjack.check();
        if (winner == null && !blackjack.dstand) {
            blackjack.ai();
        }
    },

    stand: function() {

        blackjack.doStand(0);

        var winner = null;
        if (blackjack.pstand && blackjack.dstand) {
            winner = blackjack.check();
        }
        if (winner == null) { blackjack.ai(); }
    },

    ai: function() {

        if (blackjack.dpoints >= blackjack.safety) {
            blackjack.doStand(1);
        } else {
            blackjack.doHit(1);
        }

        var winner = blackjack.check();
        if (winner == null && blackjack.pstand) { blackjack.ai(); }
    }
};

window.addEventListener("load", blackjack.init);