const Automaton = ({substrings, mainstring}) => {
    var wordFound =  {}; // nodes at which a substring is found
    var nodeStrings = {
        0: "" //root node
    }; //the strings a node represents

    // var nodeDepth = {

    // }

    //function to preprocess the substrings 
    function buildTrie(substrings) {
        //sort array such that longer length words come first
        substrings.sort(function(a, b){return b.length - a.length}); 

        //take out the first word and store in var firstWord
        let firstWord = substrings[0];
        substrings.shift();
        
        //initialize the trie
        let nextNode = {
        0: {}
        };
    
        //enter first word into the trie 
        for (let i = 0; i < firstWord.length; i++) {
        nextNode[i][firstWord.slice(0,i+1)] = i+1;
        nextNode[i+1] = {};
        nodeStrings[i+1] = firstWord.slice(0,i+1);
        }
        wordFound[firstWord.length] = firstWord;
    

        let nodenum = firstWord.length + 1; //each nodes unique number 
        let char; //char of word being added to trie
        let curr = 0; //depth of node
        let substr; //word being added to trie

        //loop through each word
        for (let i = 0; i < substrings.length; i++) {
        substr = substrings[i];

        //at the start of each word reset the depth
        curr = 0 //the depth of current node

        //loop through each prefix of the word we are adding
        for (let x = 0; x < substr.length; x++) {

            //store specific prefix in var char
            char = substr.slice(0, x+1);

            //if at the current depth the trie already contains the prefix
            if (nextNode[curr].hasOwnProperty(char)) {
            curr = nextNode[curr][char]; //move depth to next node that matches char
            }
            else {
            //create a new node at depth curr for char 
            nextNode[curr][char] = nodenum; //key is char and value is that nodes unique number
            nodeStrings[nodenum] = char;
            nodenum++; //increment nodenum
            curr = nextNode[curr][char]; //move to next node and depth
            nextNode[curr] = {}; //initialize an object for the next depth
            }
        }
        wordFound[curr] = substr;
        }
        console.log(nextNode);
        console.log(wordFound);
        console.log(nodeStrings);
        return nextNode;
    }


    function buildFailureEdges(nodeObj) {
        let failureEdges = {};
        let suffix = [];
        //generate all possible suffixs of a word
        let minMatch = 0;
        let minNode = 0;

        let substr

        for (let node in nodeObj) {

            //root node 
            if (node == 0) {
                failureEdges[0] = 0; //root nodes failure links to itself
                continue;
            }

            //nodes at depth of 1 have failure links to root node
            if (nodeObj[node].length == 1) {
                failureEdges[node] = 0;
                continue;
            }

            suffix = []
            substr = nodeObj[node];

            //fill suffix array with suffixes of substr
            for (let x = substr.length -1; x > 0; x--) {
                suffix.push(substr.slice(-x))
            }
            suffix.push("")
            console.log(suffix)

            minMatch = substr.length - 1;
            minNode = 0;

            //loop through each key and find a match
            for (let match in nodeObj) {
                if (suffix.indexOf(nodeObj[match]) < minMatch && suffix.indexOf(nodeObj[match]) != -1) {
                    minMatch = suffix.indexOf(nodeObj[match]);
                    minNode = match;
                }
            }
            
            
            failureEdges[parseInt(node)] = parseInt(minNode);
        }
        console.log(failureEdges);
        return failureEdges;
    }

    function buildDictionaryLinks(nodeObj, failureLinks, output) {
        let dictionaryLinks = {};
        let curr;

        for (let node in nodeObj) {
            curr = node
            while (curr != 0) {
                if (curr in output && curr != node) {
                    dictionaryLinks[parseInt(node)] = curr;
                    break;
                }
                curr = failureLinks[curr]; 
            }
        }
        console.log(dictionaryLinks);
    }





    return(
        <div>
            <h1>{substrings}</h1>
            <h1>{mainstring}</h1>
        </div>
    );
}

export default Automaton;
