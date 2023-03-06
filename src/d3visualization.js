import { useRef, useEffect, useState} from 'react';
import { select, hierarchy, tree, linkVertical, schemeBrBG, svg} from 'd3';
import useResizeObserver from './useResizeObserver';
import {convertData, buildTrie, buildDictionaryLinks, buildFailureEdges} from './ahoAutomaton';
import './App.css'

const TrieVisual = ({substrings, mainstring}) => {
    //dict of string represented by each node 
    var nodeStrings = {};

    //nodes that are wordnodes
    var wordFound = {};
       
    //build the node structure
    var trie = buildTrie(substrings, wordFound, nodeStrings);

    //convert to JSON form for d3 to visualize
    var trieData = convertData(trie, 0, nodeStrings); //wordfound  //nodeStrings)
    var failureLinks = buildFailureEdges(nodeStrings); //failure links between nodes
    var dictLinks = buildDictionaryLinks(trie, failureLinks, wordFound); //dictionary links between nodes
    let tempword = "Substrings Found: "; 
    var temp = false;


    //hooks
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [foundWords, setFoundWords] = useState("Substrings Found: ");
    const [firstStr, setFirstStr] = useState(mainstring);
    const [spanStr, setSpanStr] = useState("");
    const [endStr, setEndStr] = useState("");

    //searches through the whole trie to find the poisition of a certain node
    function findPosition(rootDescendants, name, rootPos, offset) {
        let shift = 0;
        if (offset) shift = 12;
        if (name === "Root") {
            return [rootPos]
        }
        for (let i = 1; i < rootDescendants.length; i++) {
            if (rootDescendants[i].data.name === name) {
                return [rootDescendants[i].x + shift, rootDescendants[i].y + shift];
            }
        }
    }
    function inverse(obj, target){
        for (let node in obj){
            if (obj[node] === target) {
            return node;
            }
        }
    }


    //converts the failure links into proper format for d3 to draw
    function convertFailLinks(rootDescendants, failLinks, nodeStrings, root) {
        let convertedLinks = []; //array to hold the current links
        let interimObj = {}; //holder object
        for (let i = 0; i < Object.keys(failLinks).length; i++) {
            interimObj={}
            //add source/target nodes position as an array to the object with specified key
            interimObj.source = findPosition(rootDescendants, nodeStrings[i], [root.x, root.y], false);
            interimObj.target = findPosition(rootDescendants, nodeStrings[failLinks[i]], [root.x+15, root.y+15], false);
            convertedLinks.push(interimObj);
        }
        return convertedLinks;
    }

    //converts the dictionary links into proper format for d3 to draw
    function convertDictLinks(rootDescendants, dictLinks, nodeStrings, root) {
        let convertedLinks = [];
        let interimObj = {};

        //for each dictionary link 
        for (let link in dictLinks) {
            interimObj={}

            //find the position of the source and target nodes 
            interimObj.source = findPosition(rootDescendants, nodeStrings[link], [root.x, root.y], true);
            interimObj.target = findPosition(rootDescendants, nodeStrings[dictLinks[link]], [root.x, root.y], true);
            //push an object with source and target x y coordinates to the converted object
            convertedLinks.push(interimObj);
        }
        return convertedLinks;
    }

    let root;
    let treeLayout;
    let svg = select(svgRef.current);
    
    useEffect(() => {
        tempword = "Substrings Found: ";
        setFoundWords("Substrings Found: ");
        svg = select(svgRef.current);

        //catch null dimensions
        if (!dimensions) return;
        root = hierarchy(trieData);

        //set dimensions of d3 tree layout 
        treeLayout = tree().size([dimensions.width/1.3, dimensions.height*4]);
        treeLayout(root);

        console.log(findPosition(root.descendants(), "hers"))
        let failLinksd3 = convertFailLinks(root.descendants(), failureLinks, nodeStrings, root);
        let dictLinksd3 = convertDictLinks(root.descendants(), dictLinks, nodeStrings, root);

        console.log(dictLinks)
        console.log(nodeStrings[7] + " " + nodeStrings[2])
        console.log(dictLinksd3)
        console.log(failLinksd3);
        console.log(root)
        console.log(wordFound)

        // svg.append("svg:defs").selectAll("marker")
        //     .data(["mid"])      // Different link/path types can be defined here
        //     .enter().append("svg:marker")    // This section adds in the arrows
        //     .attr("id", String)
        //     .attr("viewBox", "0 -5 10 10")
        //     .attr("refX", 1.5)
        //     .attr("refY", 0.5)
        //     .attr("markerWidth", 40)
        //     .attr("markerHeight", 40)
        //     .attr("orient", "auto")
        //     .append("svg:path")
        //     .attr("d", "M0,-5L10,0L0,5");


        //link all the nodes
        const createLink = linkVertical().x(node => node.x).y(node => node.y);

        //link generator for the trie and failure links 
        var linkGen = linkVertical();
        var dictLinkGen = linkVertical();
 

        svg
            .selectAll(".link")
            .data(root.links())
            .join("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", createLink);


            
        //draw paths between nodes for failure links
        svg
            .selectAll(".path")
            .data(failLinksd3)
            .join("path")
            .attr("class", "path")
            .attr("d", linkGen)
            .attr("fill", "none")
            .attr("stroke", "red");
            // .attr("marker-mid", "url(#mid)");

        //draw paths between nodes for dictionary links
        svg
            .selectAll(".dict")
            .data(dictLinksd3)
            .join("path")
            .attr("class", "dict")
            .attr("d", dictLinkGen)
            .attr("fill", "none")
            .attr("stroke", "blue");
            // .attr("marker-mid", "url(#mid)");



        svg
            .selectAll(".node")
            .data(root.descendants())
            .join("circle")
            .attr("class", "node")
            .attr("r", 38)
            .attr("fill", "#7077fa")
            .attr("cx", node => node.x)
            .attr("cy", node => node.y);

    
        //draw labels for nodes
        svg
            .selectAll(".label")
            .data(root.descendants())
            .join("text")
            .attr("class", "label")
            .text(node => node.data.name)
            .attr("text-anchor", "middle")
            .attr("font-size", 26)
            .attr("x", node => node.x)
            .attr("y", node=> node.y);

  

        //d.data.name --> name of the node d --> nodeStrings ---> nodenumber --> use as id
        //create unique id for each node
        // id = kc + node number (i.e. kc4)
        svg.selectAll('.node').attr("id",function(d) { 
            console.log(typeof inverse(nodeStrings, d.data.name).toString())
            return "kc" + inverse(nodeStrings, d.data.name).toString(); 
        });
        //print to console for test
        svg.selectAll('.node').each(function(d) {
            console.log(this); // Logs the element attached to d.
          });

        // for (let key in wordFound){
        //     svg.select('#kc' + key.toString()).style('fill','#9f91ff');
        // }

        

 
    }, [dimensions, substrings, mainstring, temp]);

    //see if algorithm fails at a node
    //returns -1 if node fails and a node number to move to if successful
    function childNodeSuccess(char, childObj) {
        console.log(childObj)
        //for each childnode of the curr node
        for (let node in childObj) {
            //if the char matches a child node return that node number
            if (char === node.charAt(node.length - 1)) {
                return childObj[node];
            }
        }
        return -1
    }

    
    async function visualize(e) {
        e.preventDefault();
        //autoscroll
        document.getElementById( 'vis' ).scrollIntoView({block: "start", inline: "nearest", behavior:"smooth"})
        
        //delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        //foundwords label
        setFoundWords("Substrings Found: ");
        tempword = "Substrings Found: ";

        let currNode = 0;
        let currChar;
        let failedRoot = false;
        console.log(wordFound);
        console.log(trie);
        let nextNode;
        let tempCurrNode;
        // let success = false;
        const delay = 250;

        for (let i = 0; i < mainstring.length + 1; i++) {
            // setTimeout(()=> {

            //catch out of bounds error
            if (i < mainstring.length) currChar = mainstring[i];

            //log current character we are on
            console.log(currChar);
            console.log(i)

            //slice the mainstring to use in html spans to highlight current char we are on
            if (i === mainstring.length) {
                setFirstStr(mainstring.slice(0, i-1))
            }
            else {
                setFirstStr(mainstring.slice(0, i)) 
            }
            setSpanStr(currChar)
            setEndStr(mainstring.slice(i+1, mainstring.length))

            //determine a child node match
            nextNode = childNodeSuccess(currChar, trie[currNode]);
            console.log(currNode)
            console.log(nextNode);
            try {
                svg.selectAll('.node').style('fill','#7077fa')
                svg.select('#kc' + currNode.toString()).style('fill','red');
            } catch(e) {
                console.log(e);
            }
            await new Promise((resolve) => setTimeout(resolve, delay));

            //if it has a dictionary link
            if (currNode in dictLinks && nextNode !== -1) {
                tempCurrNode = currNode
                tempword =  tempword + wordFound[dictLinks[currNode]] + " "
                setFoundWords(tempword);
                tempCurrNode = dictLinks[tempCurrNode]
                //check if dict link node has more a dict link itself
                while (tempCurrNode in dictLinks) {
                    tempword =  tempword + wordFound[dictLinks[tempCurrNode]] + " "
                    tempCurrNode = dictLinks[tempCurrNode]
                    setFoundWords(tempword);
                }
                console.log(tempword)
            }

            //if its a word node
            if (currNode in wordFound) {
                tempword =  tempword + wordFound[currNode] + " "
                setFoundWords(tempword);
                console.log(tempword)

                await new Promise((resolve) => setTimeout(resolve, delay));
                if (Object.keys(trie[currNode]).length === 0) {
                    currNode = failureLinks[currNode];
                    nextNode= childNodeSuccess(currChar, trie[currNode]);
                    i--
                    continue;
                }
            }


            if (i === mainstring.length && nextNode in wordFound) {
                // tempword =  tempword + wordFound[nextNode] + " "
                // svg.select('#kc' + currNode.toString()).style('fill','red');
                // setFoundWords(tempword);
                currNode = nextNode
                // i--;
                //line above maybe?
            }


            console.log(nextNode !== -1)
            //success
            if (nextNode !== -1) {
                failedRoot=false
                currNode=nextNode
                continue;
                // success = true
            }

            // if (!success) {
                //failure
            console.log(failedRoot)
            if (!failedRoot) {
                i--
            }

            currNode = failureLinks[currNode];
            if (currNode == 0) {
                failedRoot = true
            }
            else{
                failedRoot = false;
            }
            // }
            
            console.log(currNode)
        // }, 2000);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(nodeStrings)
        svg.selectAll('.node').style('fill','#7077fa')
        temp = !temp
    }

    return(
        <div>
            <button className="visualizeButton" onClick={visualize}>Search and Visualize!</button>
            <h1 className='legend'>Red Links denote Failure Links and Blue Links denote Dictionary Links<br/> Nodes with no failure link, link back to root node</h1>
            <h1 className="foundWordDisplay" id="vis">{foundWords}</h1>
            <h1 className='colorWord'>{firstStr}<span className='span'style={{color:"red"}}>{spanStr}</span>{endStr}</h1>
            <div ref = {wrapperRef} style={{marginTop: "2rem", overflow:"visible"}} className="svgDiv" >
                <svg ref={svgRef}>
                </svg>
            </div>
        </div>
    );
}

export default TrieVisual;







