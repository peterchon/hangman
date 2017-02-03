var hman = {
    answerList: ["red", "orange", "yellow", "green", "blue", "purple"],
    answer: null,
    guesses: null,
    boxes: null,
    limit: null,
    point: 0,
    hc: document.querySelector(".hangman-container"),
    wrongGuess: document.querySelector(".guesses"),
    score: document.querySelector(".score"),
    loading: null,
    start: function () {
        var generateRandomNumber = Math.floor(Math.random() * this.answerList.length);

        this.loading = false;
        this.answer = this.answerList[generateRandomNumber];
        this.hc.innerHTML = "";
        this.hc.style.borderColor = "#ccc";
        this.wrongGuess.innerHTML = "";
        this.guesses = "";
        this.boxes = [];
        this.limit = 7;

        for (var i = 0; i < this.answer.length; i++) {
            var box = document.createElement('span');
            box.className = "box";

            this.hc.appendChild(box);

            this.boxes.push(box);
        }
    },

    play: function (userInput) {
        if(this.loading) {
            return;
        }

        if (this.limit < 1) {
            var restart = document.createElement('button');
            restart.textContent = "play again";

            this.hc.innerHTML = "<p>The word was: " + this.answer + "</p>";
            this.hc.style.borderColor = this.answer;
            this.hc.appendChild(restart);

            restart.onclick = function () {
                location.reload();
            };

            return;
        }

        var isAlphabetOnly = (/^[a-z]$/).test(userInput);
        var notGuessedBefore = this.guesses.indexOf(userInput) < 0;
        var correct = "";

        for(var i=0; i< this.boxes.length; i++) {
            if(userInput === this.answer[i]) {
                this.boxes[i].textContent = userInput;
            }

            correct += this.boxes[i].textContent;
        }

        if(isAlphabetOnly && notGuessedBefore) {
            var wrongTile = document.createElement('span');
            wrongTile.className = "tile";
            wrongTile.innerHTML = userInput;

            this.wrongGuess.appendChild(wrongTile);
            this.guesses += userInput;

            if (this.answer.indexOf(userInput) < 0) {
                wrongTile.classList.add("wrong");
                this.limit--;
            }
        }

        if(correct === this.answer) {
            var time = 4;

            this.loading = true;
            this.hc.innerHTML = "You're right! the word was: " + this.answer;
            this.hc.innerHTML += "<br> Another game will start in: " + (time + 1);

            var timer = setInterval(function() {
                hman.hc.innerHTML = hman.hc.innerHTML.replace(/\d$/, time);

                time--;

                if(time < 1) {
                    clearInterval(timer);
                }
            }, 1000);

            this.hc.style.borderColor = this.answer;

            setTimeout(this.start.bind(hman), 5000);

            this.point++;
        }

        this.score.innerHTML = this.point;
    }
};

hman.start();

document.onkeyup = function(event) {

    var userInput = event.key.toLowerCase();

    hman.play(userInput);

};