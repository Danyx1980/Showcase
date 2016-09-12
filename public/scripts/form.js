document.getElementById("addCommentForm").style.display = "none";

document.getElementById("toggleComment").addEventListener("click", function(){
   var form = document.getElementById("addCommentForm");
   
   if(form.style.display === "none"){
       form.style.display = "block";
       window.scrollTo(0,document.body.scrollHeight);
   } else {
       form.style.display = "none";
   }
});