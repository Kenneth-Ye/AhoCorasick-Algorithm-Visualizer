import { useRef, useEffect} from 'react';
import { select, hierarchy, tree, linkVertical, schemeBrBG} from 'd3';
import useResizeObserver from './useResizeObserver';
import {convertData, buildTrie, buildDictionaryLinks, buildFailureEdges} from './ahoAutomaton';
import './App.css'

const TrieVisual = ({substrings, mainstring}) => {
    var nodeStrings = {};
    var wordFound = {};
    
    var trie = buildTrie(substrings, wordFound, nodeStrings);
    var trieData = convertData(trie, 0, nodeStrings); //wordfound  //nodeStrings)
    var failureLinks = buildFailureEdges(nodeStrings);


    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    function findPosition(rootDescendants, name, rootPos) {
        if (name === "Root") {
            return [rootPos]
        }
        for (let i = 1; i < rootDescendants.length; i++) {
            if (rootDescendants[i].data.name === name) {
                return [rootDescendants[i].x, rootDescendants[i].y];
            }
        }
    }


    function convertLinks(rootDescendants, dictLinks, nodeStrings, root) {
        let convertedLinks = [];
        let interimObj = {};
        for (let i = 0; i < Object.keys(dictLinks).length; i++) {
            interimObj={}
            interimObj.source = findPosition(rootDescendants, nodeStrings[i], [root.x, root.y]);
            interimObj.target = findPosition(rootDescendants, nodeStrings[dictLinks[i]], [root.x, root.y]);
            convertedLinks.push(interimObj);
        }
        return convertedLinks;
    }

    useEffect(() => {
        const svg = select(svgRef.current);
        if (!dimensions) return;
        const root = hierarchy(trieData);
        const treeLayout = tree().size([dimensions.width/1.3, dimensions.height*4]);
        treeLayout(root);

        console.log(findPosition(root.descendants(), "hers"))
        let failLinksd3 = convertLinks(root.descendants(), failureLinks, nodeStrings, root);
        console.log(failLinksd3);
        console.log(root)

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


        const createLink = linkVertical().x(node => node.x).y(node => node.y);
        var linkGen = linkVertical();
 

        svg
            .selectAll(".link")
            .data(root.links())
            .join("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", createLink)
        




        svg
            .selectAll(".node")
            .data(root.descendants())
            .join("circle")
            .attr("class", "node")
            .attr("r", 38)
            .attr("fill", "#7077fa")
            .attr("cx", node => node.x)
            .attr("cy", node => node.y);

        svg
            .selectAll(".path")
            .data(failLinksd3)
            .join("path")
            .attr("class", "path")
            .attr("d", linkGen)
            .attr("fill", "none")
            .attr("stroke", "red");
            // .attr("marker-mid", "url(#mid)");

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


 
    }, [trieData, dimensions, substrings]);

    function visualize() {
    
    }

    return(
        <div>
            <button className="visualizeButton" onClick={visualize}>Search and Visualize!</button>
            <h1 className='legend'>Red Links denote Failure Links <br/> Nodes with no failure link link back to root node</h1>
            <div ref = {wrapperRef} style={{marginTop: "2rem", overflow:"visible"}} className="svgDiv" >
                <svg ref={svgRef}>
                </svg>
            </div>
        </div>
    );
}

export default TrieVisual;

