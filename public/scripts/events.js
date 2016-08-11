var elements = document.querySelectorAll(".list-group-item");

for(var i = 0; i < elements.length; i++){
    elements[i].addEventListener("mouseover", function(){
        this.classList.add("active");
    });
    elements[i].addEventListener("mouseout", function(){
        this.classList.remove("active");
    });
}