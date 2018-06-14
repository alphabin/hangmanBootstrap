var randomWord; //ActualWord
var globalShadow; //_ _ P _ A

var correctArray = [];
var wrongArray = [];

//Helper objects
//Input validation 
var input = {
    rawInput: "",
    regexPattern: /[a-z]/,

    validInput() {
        return this.regexPattern.test(this.rawInput);
    },

    addInput: function (inKey) {
        this.rawInput = inKey;
    }
}
//WordChoice Validation
var wordChoise =
    {
        rawRequestURL: "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=4&maxLength=8&limit=1&api_key=ea4ea80435960146b90080da3d1040adfc7eab37510b972b3",
        getRandomWord: function () {
            $.ajax({
                dataType: "json",
                url: wordChoise.rawRequestURL,
                data: "",
                success: function (res) {
                    this.successRequest = res[0]["word"];
                    if (this.successRequest.indexOf('-') == -1) {
                        wordChoise.success((res[0]["word"]).toLowerCase());
                    }
                    else {

                        wordChoise.getRandomWord();
                    }
                }
            });
        },
        success: function (returnWord) {
            randomWord = returnWord; //Global is set
            console.log("[[ChaturaLOG]]" + randomWord);
            var str = randomWord;
            var shadowWord = str.replace(/./g, '_');
            globalShadow = shadowWord;
            wordChoise.updateScreen();
        },
        updateScreen() {
            // Set the inner HTML contents of the #game div to our html string
            var html = "<p>Your Word is  :<h1 class=\"hangDisplay\">" + globalShadow + "</p>";
            document.querySelector("#word").innerHTML = html;
        },
        //<iframe src="https://www.w3schools.com"></iframe>
        updateFind(searchTerm) {
            // Set the inner HTML contents of the #game div to our html string
            var html = "<iframe src=\"https://www.merriam-webster.com/dictionary/" + searchTerm + "?pronunciation&lang=en_us" + "\" width=\"100%\" height=\"300\"\"></iframe>";
            document.querySelector("#WebPage").innerHTML = html;
        }
    }



//Get Word From Api at start
wordChoise.getRandomWord();

var GameState = true;

//Helpers tho do the matching
function displayValidChar(key) {

    if (correctArray.indexOf(key) == -1) {
        var x = indexOfAll(randomWord, key);
        if (x.length > 0) {


            x.forEach(element => {
                globalShadow = returnAcorrectFormat(globalShadow, element, key);
                wordChoise.updateScreen();
            });
            correctArray.push(key);

        }
        else {
            // alert("wrong letter" + key);
            if (wrongArray.indexOf(key) == -1) {
                wrongArray.push(key);
            }
        }
    }

    //Update Lists
    this.updateCorrect();
    this.updateWrong();

    if (globalShadow === randomWord) {
        alert("Winner!!!!!!!!");
        document.getElementById("changeBack").style.opacity = 100;
        wordChoise.updateFind(randomWord);
    }

    if (wrongArray.length > 4) {
        var prompt = confirm("5 Wrong choice, Try again? Word was >>" + randomWord);
        if (prompt) {
           // alert("Reloading the Page");
            //location.reload();
            GameState =false;
        }
        else {
            GameState =false;
        }
    }

}

function updateCorrect() {
    var html = "<p>Correct Choises are  :<h1 class=\"correctDisplay\">" + correctArray.toString() + "</p>";
    document.querySelector("#correctKey").innerHTML = html;
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

function updateWrong() {
    var html = "<p>Wrong Choises are  :<h1 class=\"wrongDisplay\">" + wrongArray.toString() + "</p>";
    document.querySelector("#badKey").innerHTML = html;

}


function indexOfAll(array, searchItem) {
    var i = array.indexOf(searchItem),
        indexes = [];
    while (i !== -1) {
        indexes.push(i);
        i = array.indexOf(searchItem, ++i);
    }
    return indexes;
}

function returnAcorrectFormat(shadowWord, index, char) {
    var a = shadowWord.split("");
    a[index] = char;
    return a.join("");
};


document.onkeyup = function (event) {
    var key = event.key.toLowerCase();

    if (key.length > 1) {
        alert("OOOOPPPSSS you pressed " + key);
        return;
    }

    input.addInput(key);
    if (input.validInput()) {//Checks if the key is alphabetical
        displayValidChar(key);
    }

   
    if(GameState == false)
    {
        sleep(500);
        location.reload();        
    }

}
