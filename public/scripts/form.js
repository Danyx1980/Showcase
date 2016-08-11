document.querySelector("input[value='link']").addEventListener("click", function(){
   EnableLink();
});

document.querySelector("input[value='upload']").addEventListener("click", function(){
    EnableUpload();
});

document.querySelector("#linkDiv").addEventListener("click", function(){
    document.querySelector("form").enctype = "application/x-www-form-urlencoded";
    console.log("enctype changed");
    EnableLink();
});

document.querySelector("#uploadDiv").addEventListener("click", function(){
    console.log("enctype changed");
    document.querySelector("form").enctype = "multipart/form-data";
    EnableUpload();
});

document.querySelector("#fileLink").addEventListener("click", function(){
   EnableLink();
});

document.querySelector("#fileUpload").addEventListener("click", function(){
   EnableUpload();
});

function EnableUpload(){
    document.querySelector("#fileLink").disabled = true;
    document.querySelector("#fileUpload").disabled = false;
    document.querySelectorAll("input[name='method']")[1].checked = true;
}

function EnableLink(){
   document.querySelector("#fileUpload").disabled = true;
   document.querySelector("#fileLink").disabled = false;
   document.querySelectorAll("input[name='method']")[0].checked = true;
}