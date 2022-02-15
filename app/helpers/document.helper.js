Array.prototype.orderBy = function(selector, desc = false) {
    return [...this].sort((a, b) => {
      a = selector(a);
      b = selector(b);
  
      if (a == b) return 0;
      return (desc ? a > b : a < b) ? -1 : 1;
    });
};
module.exports = {
    wordFrequency: function(doc, word){
        if(doc.content)
            doc = doc.content;
        return this.occurrences(this.stringToWordsArray(doc), word);
    },

    wordSentences: function(doc, word){
        if(doc.content)
            doc = doc.content;
        return this.stringToPhrasesArray(doc, word);
    },

    topWords: function(doc, count, minWordLength){
        if(doc.content)
            doc = doc.content;
        return this.countTopWords(this.stringToWordsArray(doc), count, minWordLength);
    },

    stringToWordsArray: function(text) {
        return text.match(/[a-zÀ-ú]+/gmui);
    },

    stringToPhrasesArray: function(doc, word) {
        const text = JSON.stringify(doc)
            .replace(/\\n/g,'ø') // replace new lines with ø
            .replace(/\s+/g, ' ');
        let first = false;
        let phrases = [];
        let endPhrase = ['.', ':', ';', 'ø']; // ø is used to replace \n
        let notStartPhrase = [
            '-', 
            '"', 
            '\'', 
            '/', 
            '(', 
            ')', 
            ',', 
            ' ', 
            '_', 
            '“',
            '”',
            '‘',
            '’',
            'ø', 
            '.', 
            ':', 
            ';', 
            '\n',
            "\\"
        ];
        let phrase = "";
        text.split('').forEach(letter => {
            if(this.isStartPhrase(letter, first, endPhrase, notStartPhrase)) {
                first = true;
                phrase += letter;
            }  else if(this.isContinuousPhrase(letter, first, endPhrase)) {
                phrase += letter;
            } else if(this.isEndPhrase(letter, first, endPhrase, phrase)) {
                if(letter != 'ø')
                    phrase += letter;
                else
                    phrase += '\n';
                    
                phrases.push(phrase);
                phrase = "";
                first = false;
            } 
        });

        return phrases.filter(phrase => {
            return phrase.toLowerCase().includes(word);
        });
    },

    isStartPhrase: function(letter, first, endPhrase, notStartPhrase) {
        return isNaN(letter) && 
            letter === letter.toUpperCase() &&!first && 
            !endPhrase.includes(letter) && 
            !notStartPhrase.includes(letter);
    },

    isEndPhrase: function(letter, first, endPhrase, phrase) {
        return isNaN(letter) && first && 
            phrase && endPhrase.includes(letter)
    },
    isContinuousPhrase: function(letter, first, endPhrase) {
        return first && !endPhrase.includes(letter);
    },

    occurrences: function(wordsArray, word) {
        let indexes = [];
        wordsArray = wordsArray.map(element => element.toLowerCase());
        let idx = wordsArray.indexOf(word);
        while (idx != -1) {
            indexes.push(idx);
            idx = wordsArray.indexOf(word, idx + 1);
        }
        return indexes.length;
    },
    countTopWords: function(wordsArray, count, minWordLength) {
        wordsArray = wordsArray.map(element => element.toLowerCase());
        let wordsTopMinLength = wordsArray
            .filter(element => element.length >= parseInt(minWordLength));
        
        let objWordCount = [];
        wordsTopMinLength.forEach(word => {
            let tempObj = {
                    name: word, 
                    count: this.occurrences(wordsArray, word)
            };
            objWordCount.push(tempObj);
        });
        objWordCount = this.clearDuplicates(objWordCount);
        objWordCount = objWordCount.orderBy(obj => obj.count, true);
        return objWordCount
            .filter((obj, idx) => idx < count)
            .map(obj => obj);
    },
    clearDuplicates: function(array) {
        return array.filter((v,i,a) => 
            a.findIndex( t => 
                (t.name === v.name ) ) ===i);
    },
    sortObj: function(array) {
        let numArr = [];
        let sortedObj = [];
        array.map((letter) => {
          numArr.push(parseInt(letter["count"]));
        });
      
        while (numArr.length > 0) { 
          let minIndex = numArr.indexOf(Math.min(...numArr));
          numArr.splice(minIndex, 1); 
          sortedObj.push(array.splice(minIndex, 1));
        }

        return sortedObj;
    }
}


