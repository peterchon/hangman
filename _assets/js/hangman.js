/**
 * create a hman object.
 */

var hman = {
    /* Array of possible answers */
    answerList: ["red", "orange", "yellow", "green", "blue", "purple"],

    /* will hold the answer as string */
    answer: null,

    /* will hold all the guesses as string */
    guesses: null,

    /* will hold all the boxes to be filled as DOM object */
    boxes: null,

    /* will hold be the wrong guess limit as number */
    limit: null,

    /* will hold the total points earned as number */
    point: 0,

    /* select the <div class="hangman-container"> object and assign to hc property */
    hc: document.querySelector(".hangman-container"),

    /* select the <div class="guesses"> object and assign to wrongGuess property */
    wrongGuess: document.querySelector(".guesses"),

    /* select the <div class="score"> object and assign to score property */
    score: document.querySelector(".score"),

    /* loading will be used to prevent the user from doing stuff while program is loading */
    loading: null,

    /* initiate the game */
    start: function () {

        /* Generate a random number based on the length of the answersList array */
        var generateRandomNumber = Math.floor(Math.random() * this.answerList.length);

        /* Initializes the game data */
        this.loading = false;

        /**
         * assigns the randomly picked string from the answersList array.
         * if generateRandomNumber is "3", then it would get the answerList[3], which would be "green".
         */
        this.answer = this.answerList[generateRandomNumber];

        /* clears the content of hc DOM (look at line 25) */
        this.hc.innerHTML = "";

        /* sets the border-color of hc to grey(#ccc) */
        this.hc.style.borderColor = "#ccc";

        /* clears the content of wrongGuess (look at line 28) */
        this.wrongGuess.innerHTML = "";

        /* clear the user's guesses */
        this.guesses = "";

        /* resets the boxes array to an empty array */
        this.boxes = [];

        /* set the wrong guess limit */
        this.limit = 7;

        /**
         * Run this as many times as the length of the answer.
         * if answer is green, the length would be 5, so it would run 5 times.
         * if answer was red, the length would be 3, so it would run 3 times.
         */
        for (var i = 0; i < this.answer.length; i++) {

            /**
             * create a <span> and assign it to the box variable.
             * Same idea as $('<span>'), but without jQuery
             */
            var box = document.createElement('span');

            /* give it a classname of "box", so it would look like <span class="box"> */
            box.className = "box";

            /**
             * append the child to hc (look at like 25).
             * The results would look like this:
             * <div class="hangman-container">
             *     <span class="box"></span>
             * </div>
             */
            this.hc.appendChild(box);

            /**
             *  add this box (<span class="box"></span>) to the boxes array.
             *  Results would look like [box, ... ]
             */
            this.boxes.push(box);
        }
    },

    /**
     *  handles the logic when user is playing the game
     *  userInput is coming from the onkeyup event (look at line 185)
     */
    play: function (userInput) {

        /**
         * Because I have a loading time of 5 seconds between games,
         * I have to make sure nothing runs during that time.
         * I can ensure that by checking the this.loading property.
         * If this.loading property is true, then I do a "return",
         * essentially exiting out of this code ignoring the rest
         * of the code thereafter.
         */
        if(this.loading) {

            /* get me out of here! */
            return;
        }


        /**
         * I'm checking this.limit which is how many times the user has guessed wrong.
         * If this.limit is 0 (less than 1), we run the code.
         */
        if (this.limit < 1) {

            /* make a button. Similar to using $('<button>') */
            var restart = document.createElement('button');

            /* add the text to the button: <button>play again</button> */
            restart.textContent = "play again";

            /**
             * Replace all the content of hc with: <p>The word was: blue, red, etc..</p>
             * The result will be:
             * <div class="hangman-container">
             *     <p>The word was: blue, red, etc..</p>
             * </div>
             */
            this.hc.innerHTML = "<p>The word was: " + this.answer + "</p>";

            /**
             * add an inline-style for the border color.
             * The results would look like:
             * <div class="hangman-container" style="border-color:red">
             */
            this.hc.style.borderColor = this.answer;

            /**
             * Add the restart button to hc
             * The result will be:
             * <div class="hangman-container">
             *     <p>The word was: blue, red, etc..</p>
             *     <button>play again</button>
             * </div>
             */
            this.hc.appendChild(restart);

            /**
             * Bind a onclick on the restart button to refresh the page.
             * If user clicks on restart (<button>play again</button>)
             * it runs the code location.reload() that refreshes the page.
             */
            restart.onclick = function () {
                location.reload();
            };

            /**
             * Exit out.
             * Code after this return will be executed.
             */
            return;
        }

        /**
         * check the userInput using RegExp() to see if it's a single lower-cased alphabet [a-z]
         * ^ checks to see if it starts with a lower-cased alphabet
         * $ checks to see if it ends with a lower-cased alphabet.
         */
        var isAlphabetOnly = (/^[a-z]$/).test(userInput);


        /**
         * Checks the userInput against this.guesses using .indexOf()
         * "red".indexOf("r") would be 0,
         * "red".indexOf("e") would be 1,
         * "red".indexOf("d") would be 2,
         * "red".indexOf("z") would be -1,
         * so if letter is not found (less than 0) then we assign it as "false"
         */
        var notGuessedBefore = this.guesses.indexOf(userInput) < 0;

        /* create a new variable to use later */
        var correct = "";

        /**
         * Loop and run it as many times as there are number of boxes in the this.boxes array.
         * If this.boxes has 5 object, then it will run 5 times.
         */
        for(var i=0; i< this.boxes.length; i++) {

            /**
             * if user input matches the index of this.answer string,
             * then add the letter to the box object in the this.boxes array.
             */
            if(userInput === this.answer[i]) {
                /**
                 * While this is looping, i would be the # of time it looped,
                 * so if it looped 3 times, i would be 3.
                 * so I'm going take the this.boxes array (look at line 96)
                 * and get the 3rd box and add the letter to the html like so: <span class="box">[letter]</span>
                 * eventually it will make it look like: _ _ l l _ w
                 */
                this.boxes[i].textContent = userInput;
            }

            /**
             * I'm also going to construct a string based on all the boxes.
             * I'm checking the .textContent (which is the letter inside the <span>)
             * so, if it looks like _ _ l l _ w
             * then this variable would look like "llw"
             * But if the user has guess it all correct ( y e l l o w)
             * then it will be "yellow"
             * this will be used later.
             */
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
                hman.limit--;
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