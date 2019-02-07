import '../css/style.css'
/*................................................................................................................
.................................Reuseable Code..................................................................
..................................................................................................................*/
const ul = document.getElementById("userList");
const bookList  = document.getElementById("bookList");
const dropValue  = document.getElementById("dropValue");

document.getElementById('showbooks').onclick = function() {callMyApi(showAllBooks)};
document.getElementById('hidebooks').onclick = function() {hideBooks()}

function createNode(element){
    return document.createElement(element);
  }
  
  function append(parent,el){
    return parent.appendChild(el);
  }
  
  function exportToHtml(){
    document.getElementById("showbooks").style.display = "block";
    document.getElementById("msg-input").innerHTML = ""
    var userId = allData;

    let li = createNode('li'),
          a = createNode('a'),
          img = createNode('img'),
          span = createNode('span'),
          h1 = createNode('h1');
  
          li.classList.add("li_class");
          span.classList.add("span_class");
          img.src = userId.name;
          span.innerHTML = `Information - </br>
                            birth_date : ${userId.birth_date} </br>
                            death_date : ${userId.death_date}`;
          h1.innerHTML = `Name : ${userId.name}`;
  
          append(li,img);
          append(a,h1);
          append(a,span);
          append(li,a);
          append(ul,li);
  }
  

/*..............................................................................................................
....................................fetching data from database.................................................
................................................................................................................*/

var url = "http://openlibrary.org/authors/OL1A.json";

let allData = [];


fetch(url)
    .then(resp => resp.json())
    .then(data => {
        allData = data;
    })
    .catch( error => {
    console.log(JSON.stringify(error));
    })

/*....................................................................................................................
...........................................search Author Id...........................................................
......................................................................................................................*/
document.getElementById("search-author-btn").onclick = function() {searchAuthor()}

function searchAuthor(){
    var searchTxt = document.getElementById("search-author-input").value;
    var patternd = /^[A-Za-z0-9]/;

    if(searchTxt == ""){
        document.getElementById("msg-input").innerHTML = ""
        document.getElementById("userList").innerHTML = ""
        document.getElementById("msg-input").innerHTML = "!! You have to write the Author code !!"
        return false;
    }
    else if(searchTxt == "OL1A"){
        callAuthorId();
    }
    else if(!patternd.test(searchTxt)){
        document.getElementById("msg-input").innerHTML = ""
        document.getElementById("userList").innerHTML = ""
        document.getElementById("msg-input").innerHTML = "!! Author Code Should be AlphaNumeric !!"
    }
    else{
        document.getElementById("msg-input").innerHTML = ""
        document.getElementById("userList").innerHTML = ""
        document.getElementById("msg-input").innerHTML = "!! False Author Code !!"
        return false;
    }
   
}

/*.....................................................................................................................
............................................show Books...............................................................
....................................................................................................................*/
function callAuthorId(){
    document.getElementById("msg-input").innerHTML = ""
    document.getElementById("userList").innerHTML = ""
    url = "http://openlibrary.org/authors/OL1A.json"
    exportToHtml();
}

function showAllBooks(response){
    document.getElementById("showbooks").style.display = "none";
    document.getElementById("hidebooks").style.display = "block";
    document.getElementById("dropdown").style.display = "block";


    for(var i = 0 ; i < response.length ; i++){

        let li = createNode("li"),
            h4 = createNode('h4'),
            h5 = createNode('h5');
        
        h4.innerHTML = `Title : ${response[i].title}`;
        h5.innerHTML = `Date : ${response[i].created.value}`;

        append(li,h4);
        append(li,h5);
        append(bookList,li);
    }

    var subjects = response.map( subject => {
        return subject.subjects;
    })
    subjects = subjects.filter(function( element ) {
        return element !== undefined;
     });

     var subjectsArray = [];
     

     for(var i = 0; i < subjects.length ; i++){
        subjectsArray.push.apply(subjectsArray,subjects[i]);
     }

    for(var i = 0; i < subjectsArray.length ; i++){
        let a = createNode("a");
            a.innerHTML = `${subjectsArray[i]}`;
            a.setAttribute("id",`${subjectsArray[i]}`);
            a.onclick = function() {showFilterdBooks(this.id,response)}

        append(dropValue,a);
    }
}

function hideBooks(){
    document.getElementById("hidebooks").style.display = 'none';
    document.getElementById("bookList").innerHTML = '';
    document.getElementById("showbooks").style.display = "block";
    document.getElementById("dropdown").style.display = "none";
}


function callMyApi(callback){
    url = "http://openlibrary.org/authors/OL1A/works.json"
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        allData = data.entries;
        callback(allData);
    })
    .catch( error => {
    console.log(JSON.stringify(error));
    })
}

function exportBookToHtml(i,response){
    let li = createNode("li"),
            h2 = createNode('h2'),
            h3 = createNode('h3');
        
        h2.innerHTML = `Title : ${response[i].title}`;
        h3.innerHTML = `Date : ${response[i].created.value}`;

        append(li,h2);
        append(li,h3);
        append(bookList,li);
}

function showFilterdBooks(value,response){
    document.getElementById("dropDownBtn").innerHTML = `Selected Subject : ${value}`;
    document.getElementById("bookList").innerHTML = '';

    var subjects = response.map( subject => {
        return subject.subjects;
    })

    for (var i = 0 ; i < subjects.length ; i++){
        if( subjects[i] !== undefined ){
            var newArray = subjects[i];
            for (var j = 0 ; j < newArray.length ; j++){
                if( newArray[j] == value ){
                    exportBookToHtml(i,response);
                }
            } 
        }
    }
    
    /*
    var allDates = [];

    for(var i = 0 ; i < allDatesTimeOFPublication.length ; i++){
        allDates[i] = allDatesTimeOFPublication[i].slice(0,10);
    }
     
    allDates.forEach((letter, index) => {
        if(letter == value){
            exportBookToHtml(index,response);
        }
    })*/

}