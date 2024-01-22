"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let storyElement=$(`
      <li id="${story.storyId}">
      <div> 
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
    let favoriteButton=$("<button>♡</button>")
    if (currentUser.favorites.find(favorite=>favorite.storyId==story.storyId)){
      favoriteButton.text("♥")
    }
    favoriteButton.on("click",function(){
      if (favoriteButton.text()=="♡"){
        favoriteButton.text("♥")
        currentUser.addToFavorite(story)
      }
      else{
        favoriteButton.text("♡")
        currentUser.removeFromFavorite(story)
  }
    })
    if (currentUser.ownStories.find(myStory=>myStory.storyId==story.storyId)){ //we will add this story only was created by me
    let deleteButton=$("<button>❌</button>")
    deleteButton.on("click",function(){
      currentUser.removeStory(story)
      storyElement.remove()
    })
    storyElement.append(deleteButton)
  }
    storyElement.prepend(favoriteButton)
    return storyElement
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
async function addStory(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const author= $("#addStory-author").val();
  const title= $("#addStory-title").val();
  const url=$("#addStory-url").val()

  let newStory = await storyList.addStory(currentUser||{userName:"noUser"},
    {title, author, url });
  $addStoryForm.trigger("reset");
putStoryOnPage(newStory)
  
}
function putStoryOnPage(story) {
  console.debug("putStoryOnPage");

    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);

  $allStoriesList.show();
}
$addStoryForm.on("submit", addStory);

