document.addEventListener("DOMContentLoaded", function() {
    console.log("The page has finished loading!");
    shuffle();
});

document.getElementById('generate').addEventListener('click', function() {


    const anagram = shuffle(characters,structure);
    document.getElementById('anagram-output').innerHTML = anagram;
});

function update_character_field(){
    let structure = get_structure();
    structure = get_structure();
    let characters = document.getElementById("characters").value;
    //removing empty spaces
    characters.replaceAll(" ","");

    character_fields = []
    let counter = 0;
    for (const s of structure[0]){
	for (let i = 0; i < s; i++){
	    let a_field = '<input type="text" oninput="update_c_input(NUM)" id="c_fieldNUM" size="1" max_length="1" class="single_character_field">';
	    a_field = a_field.replaceAll('NUM', counter);
	    counter += 1
	    character_fields.push(a_field);
	    
	}
	character_fields.push('<span class="empty_space"> </span>');
    }
    document.getElementById("characters_fields").innerHTML = character_fields.reverse().join("");
}

function update_c_input(c_id){
    let elem = document.getElementById("c_fieldNUM".replace('NUM',c_id));
    let str = elem.value;
    let c = str.substr(-1).replace("ץ","צ").replace("ף","פ").replace("ן","נ").replace("ם","מ").replace("ך","כ");
    elem.value = c;
}


function get_structure(){
    let structure = document.getElementById("structure").value;
    const fx = /\D+/g
    //cleaning everything that is not a digit
    structure = structure.replace(fx,"-");
    structure = structure.split("-");
    //converting into numbers
    structure = structure.map(item => parseInt(item));
    //calculating the total length (needed to make sure that the anagram is relevant
    let length = 0;
    structure.forEach(num => { length += num });
    return [structure,length]
}

function get_constraints(){
    let out = [];
    let length = get_structure()[1];
    for (let i =0; i < length; i++){
	let c_id = "c_fieldNUM".replace("NUM",i);
	c = document.getElementById(c_id).value;
	if (c){
	    out.push([c,i]);
	}
    }
    return out
}

function combine_perm_with_constraints(perm,constraints){
    let structure = get_structure();
    let length = structure[1]
    let out = [];
    let loc = 0;
    let loc_in_word = 0;
    let word_order = 0;
    let word_length = 0;
    for (item of perm){
	out.push(item)
	loc += 1;
	loc_in_word += 1;
	for (constraint of constraints){
	    //check if we reached one of the constraints given by the user
	    if (constraint[1] == loc){
		//we did, let's add
		out.push(constraint[0]);
		loc += 1;//and move forward the location by one for "free"
		loc_in_word += 1;
	    }
	}
	//now we are checking if we are at the end of the word
	if (loc_in_word == structure[0][word_order]){
	    //it's the end of the word. Reset counters and push a whitespace
	    word_order += 1
	    loc_in_word = 0;
	    out.push(' ');
	}
    }
    return (out);
}

function shuffle() {
    let characters = document.getElementById('characters').value;

    let constraints = get_constraints();
    //cleanign out mess
    characters = characters.replace(' ','');
    characters = characters.replaceAll('ם','מ').replaceAll("ן","נ").replaceAll("ך","כ").replaceAll("ץ","צ").replaceAll("ף","פ");
    for (constraint of constraints){
	console.log(characters.includes(c),c,characters);
	if (!characters.includes(c)){
	    msg = "אותיות קבועות לא מתאימות לטקסט המקורי"; 
	    return msg;
	}
	c = constraint[0];
	characters = characters.replace(c,'');
    }
    
    characters = characters.split('');
    let length = characters.length;
    let permutations = permute(characters,length);
    out = '<div>'
    for (p of permutations){
	option = combine_perm_with_constraints(p,constraints);
	out += '<div>O</div>'.replace('O',option.join(''));
    }
    out += '</div>';
    return out;
    
}

function permute(characters){
    //this is a permutation function that follows the heap algorithm. 
    function swap (ii, jj){
	let temp = characters[ii];
	characters[ii] = characters[jj];
	characters[jj] = temp
    }
    
    length = characters.length
    var c = new Array(length).fill(0);
    var results = [];
    results.push(characters.slice());
    let i = 1
    while (i < length){
	if (c[i] < i){
	    if (i % 2 == 0){
		swap(0,i);
	    }else{
		swap(c[i],i);
	    }
	    results.push(characters.slice());
	    c[i] += 1;
	    i = 1;
	} else{
	    c[i] = 0;
	    i += 1;
	}
    }
    return results;
}

