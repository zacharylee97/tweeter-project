function createTweetElement(tweetData) {
  //Save required data from tweetData
  const name = tweetData.user.name;
  const avatar = tweetData.user.avatars.small;
  const handle = tweetData.user.handle;
  const text = tweetData.content.text;
  const date = timeSince(tweetData.created_at);

  //Create Tweet element using jQuery
  const $tweet = $("<article>").addClass("tweet");
  const $tweetHeader = $("<header>").addClass("tweetHeader");
  const $avatar = $("<img>").addClass("avatar").attr("src", avatar);
  const $username = $("<p>").addClass("username").text(name);
  const $handle = $("<p>").addClass("handle").text(handle);
  const $text = $("<p>").addClass("text").text(text);
  const $footer = $("<footer>").addClass("footer");
  const $date = $("<p>").addClass("date").text(date);
  const $icons = $("<div>").addClass("icons");
  const $flag = $("<i>").addClass("fas fa-flag");
  const $retweet = $("<i>").addClass("fas fa-retweet");
  const $heart = $("<i>").addClass("fas fa-heart");

  //Add click function to like button
  const $like = $("<button>").addClass("heart")
    .append($heart);


  //Append all elements to $tweet
  $tweetHeader.append($avatar, $username, $handle);
  $icons.append($flag, $retweet, $like);
  $footer.append($date, $icons);
  $tweet.append($tweetHeader, $text, $footer);
  return $tweet;
}

function renderTweets(tweets) {
  //Loops through tweets
  tweets.forEach(function(element){
    //Calls createTweetElement for each tweet
    const $tweet = createTweetElement(element);
    //Takes return value and prepends it to the tweets container
    $("#tweets-container").prepend($tweet);
  });
}

function loadTweets() {
  //Get tweets from database and renders tweets
  $.get("/tweets", function(data){
    renderTweets(data);
  });
}

function timeSince(created) {
  //Calculate seconds between now and date created
  let seconds = Math.floor((Date.now() - created) / 1000);
  //Check if created longer than a year ago
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years ago";
  } else if (interval === 1) {
    return interval + " year ago";
  }
  //Check if created longer than a month ago
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  } else if (interval === 1) {
    return interval + " month ago";
  }
  //Check if created longer than a day ago
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  } else if (interval === 1) {
    return interval + " day ago";
  }
  //Check if created longer than an hour ago
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  } else if (interval === 1) {
    return interval + " hour ago";
  }
  //Check if created longer than a minute ago
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  } else if (interval === 1) {
    return interval + " minute ago";
  }
  //Tweet was just created
  return "Just now";
}

function renderNewTweet(tweet) {
  //Calls createTweetElement for new tweet
  const $tweet = createTweetElement(tweet);
  //Takes return value and prepends it to the tweets container
  $("#tweets-container").prepend($tweet);
}

function newTweet() {
  //Validate tweet length
  let text = ($(".textbox").val());
  if (text === "") {
    $(".error").text("Please enter your tweet!").slideDown();
  } else if (text.length > 140) {
    $(".error").text("Tweet is too long!").slideDown();
  } else {
    //Serialize info from form
    let str = $(".compose-tweet").serialize();
    //Post new tweet to /tweets
    $.post("/tweets", str, function(data){
      $(".compose-tweet").trigger("reset");
      $(".counter").text(140);
      $(".error").slideUp();
      //Get new tweet from database and render tweet
      $.get("/tweets", function(data){
        let tweet = data[data.length - 1];
        renderNewTweet(tweet);
      });
    });
  }
}

$(function() {
  //Load tweets from database when DOM is ready
  loadTweets();
  //Onclick function for compose button
  $(".compose").click(function() {
    $(".compose-tweet").trigger("reset");
    $(".counter").text(140).css("color", "black");
    $(".error").css("display", "none");
    $("#new-tweet").slideToggle();
    $(".textbox").focus();
  });
  //Prevent default form submission and create new Tweet
  $(".compose-tweet").submit(function(event) {
    event.preventDefault();
    newTweet();
  });
  //Onclick function for heart button
  $("#tweets-container").on("click", ".heart", function() {
    $(this).css("color", "red");
    console.log("Liked!");
  });
});