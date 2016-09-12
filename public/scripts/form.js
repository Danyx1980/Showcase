InitializeCommentForm();
InitializePictureEditForm();
InitializeCommentEditForm();

function InitializeCommentForm(){

   var addCommentButton = document.querySelector("#toggleComment");
   
   var form = document.getElementById("addCommentForm");
   form.style.display = "none";
   if(addCommentButton){
      addCommentButton.addEventListener("click", function(){
         if(form.style.display === "none"){
             form.style.display = "block";
             window.scrollTo(0,document.body.scrollHeight);
         } else {
             form.style.display = "none";
         }   
      });
   }
}

 function InitializeCommentEditForm(){

   var editCommentButton = document.querySelectorAll(".toggleEditComment");
   
   if(editCommentButton.length >= 1){
      
      var editCommentForms = document.querySelectorAll(".editCommentForm");
      
      for(var i = 0; i < editCommentButton.length; i++){
         
         editCommentForms[i].style.display = "none";
         console.log(editCommentForms[i].style.display);
         editCommentButton[i].addEventListener("click", showEditCommentForm(editCommentForms[i]));
      }
   }
}

function showEditCommentForm(commentForm){
   return function(){
      if(commentForm.style.display === "none"){
         commentForm.style.display = "block";
      } else {
         commentForm.style.display = "none";
      }
   }
}

function InitializePictureEditForm(){

   var editPictureButton = document.querySelector("#editPictureToggle");
   
   if(editPictureButton){
      var form = document.querySelector("#editPictureForm");
      
      form.style.display = "none";
      
      editPictureButton.addEventListener("click", function(){
         if(form.style.display === "none"){
            form.style.display = "block";
         } else {
            form.style.display = "none";
         }
      });
   }
}