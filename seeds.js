var mongo = require("mongoose"),
    Campground = require("./models/picture"),
    Comment = require("./models/comment");

var data = [
        {
            name: "Los Alcarrizos",
            image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg",
            description: "Nunc euismod blandit arcu, ut blandit nibh faucibus nec. Donec blandit risus quis aliquam molestie. Aliquam ut diam vel erat auctor imperdiet non ut felis. Suspendisse sed pulvinar neque. Mauris tristique elit leo, vitae convallis erat semper id. Vestibulum non ante eu sapien lobortis rhoncus in a est. Ut faucibus ligula at diam placerat, vitae cursus nisi ultricies. Suspendisse elementum tempor neque a interdum. Sed aliquam fermentum risus, a semper sapien imperdiet eu. Pellentesque cursus nulla sed ullamcorper lacinia.Donec viverra odio quis massa mattis facilisis. Aliquam et finibus metus. Nullam sit amet dui sit amet sapien sagittis tempus. Vivamus et fringilla sapien, vel feugiat felis. Vivamus at dolor nibh. Vivamus posuere imperdiet magna, vitae semper risus lacinia nec. Sed eu purus consectetur, sollicitudin justo eget, convallis massa. In malesuada velit vitae ex aliquam efficitur. Ut aliquam vehicula eros ut iaculis. Nunc mattis sem felis, at malesuada est ultrices non. Fusce non accumsan ante. Praesent nec euismod quam. Sed ornare libero sed ex lobortis, a pellentesque erat iaculis."
        },
        {
            name: "Mounth Burns",
            image: "https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg",
            description: "Bacon ipsum dolor amet beef picanha capicola landjaeger flank doner pork loin ham cow shank. Pig tongue ground round, capicola pancetta filet mignon ribeye swine drumstick sausage shoulder. Tri-tip boudin chuck, tail drumstick short loin pastrami. Kevin sausage shankle meatloaf pastrami. Capicola alcatra flank beef ribs doner bresaola salami turducken meatball swine leberkas rump filet mignon andouille cow. Kielbasa beef ribs filet mignon frankfurter spare ribs, rump beef biltong. Shank alcatra jowl drumstick tri-tip."
        },
        {
            name: "Alli",
            image: "https://farm8.staticflickr.com/7338/9627572189_12dbd88ebe.jpg",
            description: "In an ideal world this website wouldn’t exist, a client would acknowledge the importance of having web copy before the design starts. Needless to say it’s very important, content is king and people are beginning to understand that. However, back over in reality some project schedules and budgets don’t allow for web copy to be written before the design phase, this is sad but true. We’re here to help, we’ve written examples of web copy for over 40 industries for you to use at concept phase of your projects to bring a little life and realism to your designs and help you think about who and what you are designing for. We want clients and designers alike to think about their design and how it will work with the web copy, we want you think about how numbers, symbols and bullet points will look."
        }
        
    ];

function seedDB(){
    Campground.remove({}, function(err){
       if(err) {
           
           console.log(err);
           
       } else {
           
           console.log("Campgrounds removed");
           Comment.remove({}, function(err){
               
               if(err){
                   
                   console.log(err);
                   
               } else {
                   
                   console.log("Comments removed");
                   
                   data.forEach(function(seed){
                      Campground.create(seed, function(err, campground){
                          
                         if(err) {
                             
                             console.log(err);
                             
                         } else {
                             
                             console.log(campground.name + " created");
                             Comment.create({
                                 author: "Adrian",
                                 body: "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment."
                             }, function(err, comment){
                                 
                                 if(err){
                                     
                                     console.log(err);
                                     
                                 } else {
                                     campground.comments.push(comment);
                                     campground.save();
                                     console.log(comment.author + "'s comment created");
                                 }
                             });
                         }
                      });
                   });
               }
           })
       }
    });
};

module.exports = seedDB; 