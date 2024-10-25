let words_list = []

document.addEventListener("DOMContentLoaded", function() {
    console.log("The page has finished loading!");
    update_character_field();
    
    Papa.parse("./data/strings.csv",{
	download:true,
	header:false,
	complete: function(results) {
	    let row_number = 0;
	    const header_length = 2;
	    for (result of results.data.slice(2)){
		if (row_number < header_length){
		    row_number += 1;
		    continue;
		}
		words_list.push(result[0])
	    }
	    console.log("loaded srings list");
	},
	error: function (error){
	    console.log("error loading word list: ", error);
	}
    });
    //shuffle();
});

document.getElementById('generate').addEventListener('click', function() {
    const anagram = shuffle(characters,structure);
    document.getElementById('anagram-output').innerHTML = anagram;
});

function characters_input_updated(){
    let characters = document.getElementById("characters").value;
    characters = characters.replaceAll(" ","");
    document.getElementById("structure").value = characters.length
    update_character_field()
}

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
    document.getElementById("characters_fields").innerHTML = character_fields.join("");
}

function update_c_input(c_id){
    //used to make sure that in each field there is only one character and that it is not in the end-of-word form
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

function check_if_word_in_sting_list(characters_in){
    parts = characters_in.join('').split(' ');
    for (part of parts){
	part = part.replace(/מ$/,'ם').replace(/כ/,'ך').replace(/נ/,'ן').replace(/צ/,'ץ').replace(/פ/,'ף');
	if (!words_list.includes(part)){
	    return false;
	}
    }
    //we are suposed to be here only if all parts are in the list 
    return true

}

function switch_to_end_character(character_in){
    switch(character_in){
    case 'פ':
	return 'ף';
	break
    case 'מ':
	return 'ם';
	break;
    case 'צ':
	return 'ץ';
	break;
    case 'כ':
	return 'ך';
	break;
    case 'נ':
	return 'ן';
	break;
    default:
	return character_in
	
    }
    
}

function combine_perm_with_constraints(perm,constraints){
    let structure = get_structure();
    let length = structure[1]
    let out = [];
    let loc = 0;
    let loc_in_word = 0;
    let word_order = 0;
    let word_length = 0;
    let out2 = perm.slice();
    for (c of constraints){
	out2.splice(c[1],0,c[0]);
    }
    for (s of structure[0]){
	out2.splice(loc +s + word_order,0,' ');
	loc += s + word_order;
	out2[loc-1] = switch_to_end_character(out2[loc-1]);
	word_order += 1;
	if (word_order == structure[0].length-1){p
	    break;
	}
    }
    return(out2);
}

function shuffle() {
    let characters = document.getElementById('characters').value;
    let constraints = get_constraints();
    //cleanign out mess
    characters = characters.replaceAll(' ','');
    characters = characters.replaceAll('ם','מ').replaceAll("ן","נ").replaceAll("ך","כ").replaceAll("ץ","צ").replaceAll("ף","פ");
    for (constraint of constraints){
	c = constraint[0];
	if (!characters.includes(c)){
	    msg = "אותיות קבועות לא מתאימות לטקסט המקורי"; 
	    return msg;
	}
	characters = characters.replace(c,'');
    }

    //checking that the message is not too long
    if (characters.length > 8){
	let msg = "יש יותר מ8 אותיות לחיפוש שהן יותר מ40,000 אפשרויות. אנה הזן אותיות ידועות.";
	return msg;

    }
    console.log(constraints,constraints.length);
    
    characters = characters.split('');
    let length = characters.length;
    let permutations = permute(characters,length);
    let existing_words = '<div>'
    let non_existing_words = '<div>'
    for (p of permutations){
	let option = combine_perm_with_constraints(p,constraints);
	let is_word_exists = check_if_word_in_sting_list(option)
	option = option.join('');
	if (is_word_exists){
	    existing_words += '<div>O</div>'.replace('O',option);
	} else {
	    non_existing_words += '<div>O</div>'.replace('O',option);
	}
    }
    let out = '<h3>אפשריות עם מילים שנמצאו</h3>' + existing_words + '</div>';
    out += '<h3>אפשרויות נוספות</h3>' + non_existing_words + '</div>';
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

