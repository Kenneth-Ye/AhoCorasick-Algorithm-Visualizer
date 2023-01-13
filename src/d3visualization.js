import { useRef, useEffect} from 'react';
import { select, hierarchy, tree, linkVertical} from 'd3';
import useResizeObserver from './useResizeObserver';
import {convertData, buildTrie, buildDictionaryLinks, buildFailureEdges} from './ahoAutomaton';
import './App.css'

const TrieVisual = ({substrings, mainstring}) => {
    var nodeStrings = {};
    var wordFound = {};
    
    var trie = buildTrie(substrings, wordFound, nodeStrings);
    var trieData = convertData(trie, 0, nodeStrings); //wordfound  //nodeStrings)

    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    console.log(trieData);

    useEffect(() => {
        const svg = select(svgRef.current);
        if (!dimensions) return;
        const root = hierarchy(trieData);
        const treeLayout = tree().size([dimensions.width/1.75, dimensions.height*4]);
        treeLayout(root);
        console.log()
        //draw nodes

        const createLink = linkVertical().x(node => node.x).y(node => node.y);

 

        svg
            .selectAll(".link")
            .data(root.links())
            .join("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", createLink);

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
        .selectAll(".label")
        .data(root.descendants())
        .join("text")
        .attr("class", "label")
        .text(node => node.data.name)
        .attr("text-anchor", "middle")
        .attr("font-size", 26)
        .attr("x", node => node.x)
        .attr("y", node=> node.y);


 
    }, [trieData, dimensions]);

    function visualize() {

    }

    return(
        <div>
            <button className="visualizeButton" onClick={visualize}>Search and Visualize!</button>
            <div ref = {wrapperRef} style={{marginTop: "2rem", overflow:"visible"}} className="svgDiv" >
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
}

export default TrieVisual;

