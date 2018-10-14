function createTweetElement(tweetData) {
  //Save required data from tweetData
  const name = tweetData.user.name;
  const avatar = tweetData.user.avatars.small;
  const handle = tweetData.user.handle;
  const text = tweetData.content.text;
  const created = daysSince(tweetData.created_at);
  const date = dateFormat(created);

  //Create Tweet element using jQuery
  const $tweet = $("<article>").addClass("tweet");

  const $tweetHeader = $("<header>").addClass("tweetHeader");
  const $avatar = $("<img>").addClass("avatar").attr("src", avatar);
  const $username = $("<p>").addClass("username").text(name);
  const $handle = $("<p>").addClass("handle").text(handle);
  $tweetHeader.append($avatar, $username, $handle);

  const $text = $("<p>").addClass("text").text(text);

  const $footer = $("<footer>").addClass("footer");
  const $date = $("<p>").addClass("date").text(date);
  const $icons = $("<div>").addClass("icons");
  const $flag = $("<i>").addClass("fas fa-flag");
  const $retweet = $("<i>").addClass("fas fa-retweet");
  const $heart = $("<i>").addClass("fas fa-heart");

  $icons.append($flag, $retweet, $heart);
  $footer.append($date, $icons);

  $tweet.append($tweetHeader, $text, $footer);

  return $tweet;
}

function renderTweets(tweets) {
  //Loops through tweets
  tweets.forEach(function(element){
    //Calls createTweetElement for each tweet
    var $tweet = createTweetElement(element);
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

function daysSince(date) {
  //The number of milliseconds in one day
  var ONE_DAY = 1000 * 60 * 60 * 24;
  //Calculate the difference between date and today in milliseconds
  var today = Date.now();
  var difference = today - date;
  //Convert back to days and return
  return Math.round(difference/ONE_DAY);
}

function dateFormat(created) {
  //Format date statement
  let result;
  if (created === 1) {
    result = created + " day old";
  } else {
    result = created + " days old";
  }
  return result;
}

function renderNewTweet(tweet) {
  //Calls createTweetElement for new tweet
  var $tweet = createTweetElement(tweet);
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
    $(".error").slideUp();
    //Serialize info from form
    let str = $(".target").serialize();
    //Post new tweet to /tweets
    $.post("/tweets", str, function(data){
      $(".target").trigger("reset");
      $(".counter").text(140);
      //Get new tweet from database and render tweet
      $.get("/tweets", function(data){
        let tweet = data[data.length - 1];
        renderNewTweet(tweet);
      });
    });
  }
}

//Load tweets from database when DOM is ready
$(function() {
  loadTweets();
});