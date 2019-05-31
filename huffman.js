function startCompress(){
    //remove unicode chars
    document.getElementById("inputbox").value = document.getElementById("inputbox").value.replace(/[^\x00-\x7F]/g, "");

    let unconvertedLength = convertAscii();
    let h = new Huffman(document.getElementById("inputbox").value);
    h.convert();
    console.log(h.convertedTable);

    let input = (' ' + document.getElementById("inputbox").value).slice(1) ;

    for(let i = 0; i < h.convertedTable.length; i++){
        input = input.replaceAll(Object.keys(h.convertedTable[i]), (h.convertedTable[i][Object.keys(h.convertedTable[i])]));
        //console.log(bruh);
        //console.log(Object.keys(h.convertedTable[i]));
        //console.log((h.convertedTable[i][Object.keys(h.convertedTable[i])]));
    }

    document.getElementById("compbin").value = input;


    let huffmanLength = input.length;
    let info = "Length of huffman binary: ";
    info += Math.ceil(huffmanLength / 8);

    info += " bytes, or ";
    info += huffmanLength ;
    info += " bits.";

    
    let percentChange = (((unconvertedLength * 8 ) - (huffmanLength)) / (unconvertedLength * 8)) * 100;
    percentChange = percentChange.toFixed(2);
    document.getElementById("info1").innerHTML = info;
    document.getElementById("percent").innerHTML  = "Percent decrease: " + percentChange + "%";


}

//from https://www.jacklmoore.com/notes/rounding-in-javascript/
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

//adapted from https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
String.prototype.replaceAll = function(search, replacement) {
    search = ("" + search);
    //escape all regex chars or else replace will throw an error
    search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return this.replace(new RegExp(search, 'g'), replacement);
};



function convertAscii() {
    let info = "Length of normal binary: ";
    let output = document.getElementById("normalbin");
    let input = "" + document.getElementById("inputbox").value;
    
    let  i = 0;
    output.value = "";

    while(input.length > 1) {
        
        let a = input[0].charCodeAt(0).toString(2);
        a = new Array(9 - a.length).join('0') + a; 
        output.value += a;
        input = input.slice(1);
        i++
    }
    i++;
    info += i;
    info += " bytes, or ";
    info += i * 8 ;
    info += " bits.";

    document.getElementById("asciilength").innerHTML = info;
    return i;
  }

class Node {
    constructor(left, right, char, freq){
        this.left = left;
        this.right = right;
        this.char = char;
        this.freq = freq;
    }

}


//from https://stackoverflow.com/questions/18619785/counting-frequency-of-characters-in-a-string-using-javascript
let counter = str => {
    return str.split('').reduce((total, letter) => {
      total[letter] ? total[letter]++ : total[letter] = 1;
      return total;
    }, {});
  };


class Huffman {
    constructor(text){
        this.text = text;
        //generate frequency table
        this.freqs = counter(this.text);
        this.tree = [];
        this.convertedTable = [];
    }
    //asapted from pseudocode: https://riptutorial.com/algorithm/example/23995/huffman-coding
    convert(){
        let queue = [];
        //sort frequences in decending order
        let feqsSorted = Object.keys(this.freqs).sort((a,b) => this.freqs[b]-this.freqs[a]);
        
        console.log(feqsSorted);

        for(let idx in feqsSorted){
            let node1 = new Node(null, null, feqsSorted[idx], null, null);
            node1.freq = this.freqs[feqsSorted[idx]];
            queue.push(node1);
        } 
        let z;
        console.log(queue);
        while(queue.length != 1){
            z = new Node();
            z.left = queue.shift(); //z.left = " "
            z.right = queue.shift(); //z.right = "e"
            z.freq = z.left.freq + z.right.freq;
            queue.push(z);
        }
        this.tree = queue;  
        this.generate_table();
    }



    traverse(root, visits){
        if(root == null) return;
        if(typeof(root.char) == "string" ){

            this.convertedTable.push({[root.char] : visits});
            return;
        }
        this.traverse(root.right, visits + "1");

        this.traverse(root.left, visits + "0");


    }

    generate_table(){
        let visit_history = "";
        this.traverse(this.tree[0], visit_history);
    }

}